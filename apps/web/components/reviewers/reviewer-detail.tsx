"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RiPencilLine, RiDeleteBinLine, RiRefreshLine, RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDistanceToNow } from "@/lib/date";
import type { Reviewer } from "@/types";

interface ReviewerDetailProps {
  reviewer: Reviewer;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="text-xs font-normal">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ReviewerDetail({ reviewer }: ReviewerDetailProps) {
  const router = useRouter();
  const [buildingPersona, setBuildingPersona] = useState(false);

  async function handleBuildPersona() {
    setBuildingPersona(true);
    try {
      const res = await fetch(`/api/reviewers/${reviewer.id}/build-persona`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Persona rebuilt from critique history");
      router.refresh();
    } catch {
      toast.error("Failed to build persona. Make sure this reviewer has critique history.");
    } finally {
      setBuildingPersona(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete reviewer "${reviewer.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/reviewers/${reviewer.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Reviewer deleted");
      router.push("/reviewers");
    } catch {
      toast.error("Failed to delete reviewer.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm font-medium bg-muted">
              {initials(reviewer.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{reviewer.name}</h2>
            <p className="text-sm text-muted-foreground">
              {[reviewer.seniority, reviewer.role, reviewer.team].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Added {formatDate(reviewer.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBuildPersona}
            disabled={buildingPersona}
          >
            {buildingPersona ? (
              <RiLoader4Line className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <RiRefreshLine className="h-3.5 w-3.5 mr-1.5" />
            )}
            Rebuild Persona
          </Button>
          <LinkButton href={`/reviewers/${reviewer.id}/edit`} variant="outline" size="sm">
            <RiPencilLine className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </LinkButton>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
            <RiDeleteBinLine className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Persona Summary */}
      {reviewer.personaSummary && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Persona Summary
              {reviewer.personaBuiltAt && (
                <span className="text-xs font-normal text-muted-foreground">
                  Updated {formatDistanceToNow(reviewer.personaBuiltAt)}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reviewer.personaSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Persona Traits */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Section title="Critique Tendencies" items={reviewer.critiqueTendencies} />
        <Section title="Common Feedback Themes" items={reviewer.commonFeedbackThemes} />
        <Section title="Preferred Framing" items={reviewer.preferredFraming} />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Common Questions
          </p>
          {reviewer.commonQuestions.length === 0 ? (
            <p className="text-xs text-muted-foreground">None recorded</p>
          ) : (
            <ul className="space-y-1">
              {reviewer.commonQuestions.map((q) => (
                <li key={q} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-muted-foreground/50 mt-0.5">›</span>
                  <span>&ldquo;{q}&rdquo;</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
