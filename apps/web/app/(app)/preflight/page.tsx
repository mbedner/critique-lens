import Link from "next/link";
import { Plus, Zap } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { PreflightAnalysis } from "@/types";

async function getAnalyses(): Promise<PreflightAnalysis[]> {
  // TODO: replace with db query
  return [];
}

function ReadinessBadge({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) return null;
  const className = cn(
    "text-xs font-medium",
    score >= 75 ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
    score >= 50 ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
    "border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
  );
  return <Badge variant="outline" className={className}>{score}/100</Badge>;
}

export default async function PreflightPage() {
  const analyses = await getAnalyses();

  return (
    <>
      <PageHeader
        title="Preflight"
        description="Run a critique analysis before your next review"
        actions={
          <LinkButton href="/preflight/new" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Analysis
          </LinkButton>
        }
      />
      <main className="flex-1 p-6">
        {analyses.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No analyses yet"
            description="Upload a frame and select a reviewer to run your first preflight critique."
            action={
              <LinkButton href="/preflight/new" size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Run first analysis
              </LinkButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <Link key={analysis.id} href={`/preflight/${analysis.id}`}>
                <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium line-clamp-1">
                        {analysis.frameName ?? "Untitled frame"}
                      </p>
                      <ReadinessBadge score={analysis.readinessScore} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {analysis.predictedConcerns.length} concern{analysis.predictedConcerns.length !== 1 ? "s" : ""} ·{" "}
                      {analysis.likelyQuestions.length} question{analysis.likelyQuestions.length !== 1 ? "s" : ""} ·{" "}
                      {analysis.rationaleGaps.length} gap{analysis.rationaleGaps.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(analysis.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
