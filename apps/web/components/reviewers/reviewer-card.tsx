import Link from "next/link";
import { formatDistanceToNow } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, RefreshCw } from "lucide-react";
import type { Reviewer } from "@/types";

interface ReviewerCardProps {
  reviewer: Reviewer;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ReviewerCard({ reviewer }: ReviewerCardProps) {
  return (
    <Link href={`/reviewers/${reviewer.id}`}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs font-medium bg-muted">
                  {initials(reviewer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{reviewer.name}</p>
                {(reviewer.role || reviewer.team) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[reviewer.role, reviewer.team].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {reviewer.critiqueTendencies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {reviewer.critiqueTendencies.slice(0, 4).map((t) => (
                <Badge key={t} variant="secondary" className="text-xs font-normal">
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
            <p className="text-xs text-muted-foreground line-clamp-2">
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
              <span>No persona built yet</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
