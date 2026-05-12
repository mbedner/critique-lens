"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, RefreshCw } from "lucide-react";
import { easeOutExpo, springSnappy } from "@/components/ui/motion";
import type { Reviewer } from "@/types";

interface ReviewerCardProps {
  reviewer: Reviewer;
  index?: number;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ReviewerCard({ reviewer, index = 0 }: ReviewerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.07, ease: easeOutExpo }}
      whileHover={{ y: -3, transition: springSnappy }}
    >
      <Link href={`/reviewers/${reviewer.id}`} className="block">
        <Card className="group cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:shadow-black/[0.07]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.06, transition: springSnappy }}>
                  <Avatar className="h-9 w-9 ring-2 ring-[var(--violet)]/10">
                    <AvatarFallback className="text-xs font-semibold bg-[var(--violet-light)] text-[var(--violet)]">
                      {initials(reviewer.name)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <p className="text-sm font-semibold leading-none tracking-tight">{reviewer.name}</p>
                  {(reviewer.role || reviewer.team) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[reviewer.role, reviewer.team].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {reviewer.critiqueTendencies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {reviewer.critiqueTendencies.slice(0, 4).map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs font-normal bg-[var(--violet-light)] text-[var(--violet)] border-[var(--violet)]/15">
                    {t}
                  </Badge>
                ))}
                {reviewer.critiqueTendencies.length > 4 && (
                  <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                    +{reviewer.critiqueTendencies.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {reviewer.personaSummary && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {reviewer.personaSummary}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
              {reviewer.personaBuiltAt ? (
                <>
                  <RefreshCw className="h-3 w-3" />
                  <span>Persona updated {formatDistanceToNow(reviewer.personaBuiltAt)}</span>
                </>
              ) : (
                <span className="italic">No persona built yet</span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
