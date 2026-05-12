"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/shared/tag-input";
import { cn } from "@/lib/utils";
import type { Reviewer, Project, Pbi } from "@/types";

const formSchema = z.object({
  content: z.string().min(1, "Critique content is required"),
  reviewerId: z.string().optional(),
  projectId: z.string().optional(),
  pbiId: z.string().optional(),
  source: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]),
  outcome: z.enum(["accepted", "rejected", "deferred", "pending"]),
  tags: z.array(z.string()),
  critiqueDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CritiqueFormProps {
  reviewers: Reviewer[];
  projects: Project[];
  pbis: Pbi[];
}

export function CritiqueForm({ reviewers, projects, pbis }: CritiqueFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      severity: "medium" as const,
      outcome: "pending" as const,
      tags: [],
    },
  });

  const filteredPbis = pbis.filter((p) => !selectedProjectId || p.projectId === selectedProjectId);

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

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          formData.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
        }
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/critiques", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Critique saved");
      router.push("/critiques");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Critique Content */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Critique Content</h2>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Critique Text</FormLabel>
                <FormDescription>
                  Paste critique notes, Slack messages, or meeting notes. Raw text is fine.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="The filter bar is too prominent — it's taking up cognitive space before users have even oriented themselves to the data. What's the primary action here? This feels like we're solving for power users but shipping to everyone..."
                    className="min-h-40 resize-none font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Screenshot (optional)</p>
            {imagePreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Critique screenshot"
                  className="max-h-48 rounded-md border object-contain"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -right-2 -top-2 rounded-full bg-background border p-0.5 shadow-sm hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 text-center transition-colors",
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleImageDrop}
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Drag & drop or <span className="text-foreground underline underline-offset-2">browse</span>
                </span>
                <span className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>
        </section>

        {/* Attribution */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Attribution</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="reviewerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reviewers.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={(v) => { field.onChange(v); setSelectedProjectId(v ?? ""); form.setValue("pbiId", ""); }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pbiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PBI</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={filteredPbis.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={filteredPbis.length === 0 ? "Select a project first" : "Select PBI"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPbis.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Where did this come from?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting notes</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Teams</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="notes">Personal notes</SelectItem>
                      <SelectItem value="screenshot">Screenshot annotation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="critiqueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of critique</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Classification */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Classification</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="deferred">Deferred</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormDescription>
                  Add topics for searchability (e.g. hierarchy, filters, export, onboarding).
                </FormDescription>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="Add tag…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save critique"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
