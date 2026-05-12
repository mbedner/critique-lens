"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Image as ImageIcon } from "lucide-react";
import { easeOutExpo, springSnappy } from "@/components/ui/motion";
import type { Critique } from "@/types";

const outcomeConfig: Record<string, string> = {
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  deferred: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-zinc-50 text-zinc-500 border-zinc-200",
};

interface CritiqueCardProps {
  critique: Critique;
  reviewerName?: string;
  projectName?: string;
  index?: number;
}

export function CritiqueCard({ critique, reviewerName, projectName, index = 0 }: CritiqueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.07, ease: easeOutExpo }}
      whileHover={{ y: -3, transition: springSnappy }}
    >
      <Card className="cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/[0.07]">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <SeverityBadge severity={critique.severity} />
              <Badge
                variant="outline"
                className={`text-xs font-medium ${outcomeConfig[critique.outcome] ?? ""}`}
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
            <time className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
              {critique.critiqueDate ? formatDate(critique.critiqueDate) : formatDate(critique.createdAt)}
            </time>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <p className="text-sm leading-relaxed line-clamp-4">{critique.content}</p>

          {critique.themes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {critique.themes.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs font-normal bg-[var(--violet-light)] text-[var(--violet)] border-[var(--violet)]/15">
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
    </motion.div>
  );
}
