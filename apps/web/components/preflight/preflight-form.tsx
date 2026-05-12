"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RiUploadLine, RiCloseLine, RiLoader4Line, RiFlashlightLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Reviewer, Project, Pbi } from "@/types";

interface PreflightFormProps {
  reviewers: Reviewer[];
  projects: Project[];
  pbis: Pbi[];
}

export function PreflightForm({ reviewers, projects, pbis }: PreflightFormProps) {
  const router = useRouter();
  const [reviewerId, setReviewerId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [pbiId, setPbiId] = useState("");
  const [annotationNotes, setAnnotationNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredPbis = pbis.filter((p) => !projectId || p.projectId === projectId);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewerId) { toast.error("Select a reviewer."); return; }
    if (!imageFile) { toast.error("Upload a frame screenshot."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("reviewerId", reviewerId);
      if (projectId) formData.append("projectId", projectId);
      if (pbiId) formData.append("pbiId", pbiId);
      if (annotationNotes) formData.append("annotationNotes", annotationNotes);
      formData.append("image", imageFile);

      const res = await fetch("/api/preflight", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/preflight/${data.id}`);
    } catch {
      toast.error("Analysis failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Frame Upload */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Frame / Screen
        </Label>
        {imagePreview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Frame to analyze"
              className="max-h-72 w-full rounded-lg border object-contain bg-muted/30"
            />
            <button
              type="button"
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute right-2 top-2 rounded-full bg-background border p-1 shadow-sm hover:bg-muted"
            >
              <RiCloseLine className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleImageDrop}
          >
            <RiUploadLine className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Drop a frame screenshot here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or <span className="text-foreground underline underline-offset-2">browse</span> · PNG, JPG, WebP
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Figma plugin also available for direct frame export
            </p>
            <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} />
          </label>
        )}
      </div>

      {/* Analysis Setup */}
      <div className="space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Analysis Setup
        </Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="reviewer">Reviewer <span className="text-destructive">*</span></Label>
            <Select onValueChange={(v) => setReviewerId(v ?? "")} value={reviewerId}>
              <SelectTrigger id="reviewer">
                <SelectValue placeholder="Who is reviewing?" />
              </SelectTrigger>
              <SelectContent>
                {reviewers.length === 0 ? (
                  <SelectItem value="_" disabled>No reviewers — add one first</SelectItem>
                ) : (
                  reviewers.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}{r.role ? ` · ${r.role}` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project">Project</Label>
            <Select
              onValueChange={(v) => { setProjectId(v ?? ""); setPbiId(""); }}
              value={projectId}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pbi">PBI</Label>
            <Select onValueChange={(v) => setPbiId(v ?? "")} value={pbiId} disabled={filteredPbis.length === 0}>
              <SelectTrigger id="pbi">
                <SelectValue placeholder={filteredPbis.length === 0 ? "Select a project first" : "Select PBI"} />
              </SelectTrigger>
              <SelectContent>
                {filteredPbis.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Optional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Annotation / interaction notes (optional)</Label>
        <Textarea
          id="notes"
          value={annotationNotes}
          onChange={(e) => setAnnotationNotes(e.target.value)}
          placeholder="Add any context the AI can't see from the screenshot: hover states, flows, interaction intent, known constraints…"
          className="min-h-24 resize-none text-sm"
        />
      </div>

      <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
        {loading ? (
          <>
            <RiLoader4Line className="h-4 w-4 mr-2 animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            <RiFlashlightLine className="h-4 w-4 mr-2" />
            Run Preflight Critique
          </>
        )}
      </Button>
    </form>
  );
}
