import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Image as ImageIcon } from "lucide-react";
import type { Critique } from "@/types";

const outcomeConfig = {
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400",
  rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400",
  deferred: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400",
  pending: "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400",
};

interface CritiqueCardProps {
  critique: Critique;
  reviewerName?: string;
  projectName?: string;
}

export function CritiqueCard({ critique, reviewerName, projectName }: CritiqueCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <SeverityBadge severity={critique.severity} />
            <Badge
              variant="outline"
              className={`text-xs font-medium ${outcomeConfig[critique.outcome]}`}
            >
              {critique.outcome.charAt(0).toUpperCase() + critique.outcome.slice(1)}
            </Badge>
            {critique.imageUrl && (
              <Badge variant="outline" className="gap-1 text-xs font-normal text-muted-foreground">
                <ImageIcon className="h-2.5 w-2.5" />
                Screenshot
              </Badge>
            )}
          </div>
          <time className="shrink-0 text-[11px] text-muted-foreground">
            {critique.critiqueDate ? formatDate(critique.critiqueDate) : formatDate(critique.createdAt)}
          </time>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-sm leading-relaxed line-clamp-4">{critique.content}</p>

        {critique.themes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {critique.themes.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {reviewerName && <span>{reviewerName}</span>}
          {reviewerName && projectName && <span>·</span>}
          {projectName && <span>{projectName}</span>}
          {critique.source && (
            <>
              {(reviewerName || projectName) && <span>·</span>}
              <span className="capitalize">{critique.source}</span>
            </>
          )}
        </div>

        {critique.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {critique.tags.map((t) => (
              <span key={t} className="text-[11px] text-muted-foreground">#{t}</span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
