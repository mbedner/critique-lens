import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { AlertTriangle, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreflightAnalysis } from "@/types";

interface AnalysisResultsProps {
  analysis: PreflightAnalysis;
  reviewerName?: string;
  pbiTitle?: string;
}

function ReadinessGauge({ score }: { score: number }) {
  const color =
    score >= 75 ? "text-emerald-600" :
    score >= 50 ? "text-amber-600" :
    "text-red-600";
  const label =
    score >= 75 ? "Review Ready" :
    score >= 50 ? "Needs Work" :
    "Not Ready";

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span className={cn("text-4xl font-bold tabular-nums", color)}>{score}</span>
      <span className="text-xs text-muted-foreground">/ 100</span>
      <Badge
        variant="outline"
        className={cn(
          "mt-1 text-xs font-medium",
          score >= 75 ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
          score >= 50 ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
          "border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
        )}
      >
        {label}
      </Badge>
    </div>
  );
}

export function AnalysisResults({ analysis, reviewerName, pbiTitle }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="flex flex-wrap items-start gap-4 rounded-lg border p-4 bg-muted/30">
        {analysis.readinessScore !== null && analysis.readinessScore !== undefined && (
          <ReadinessGauge score={analysis.readinessScore} />
        )}
        <Separator orientation="vertical" className="h-16 hidden sm:block" />
        <div className="flex-1 space-y-1">
          {reviewerName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Reviewer:</span>
              <span className="font-medium">{reviewerName}</span>
            </div>
          )}
          {pbiTitle && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">PBI:</span>
              <span className="font-medium">{pbiTitle}</span>
            </div>
          )}
          {analysis.frameName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Frame:</span>
              <span className="font-mono text-xs">{analysis.frameName}</span>
            </div>
          )}
          {analysis.confidenceScore !== null && analysis.confidenceScore !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Confidence:</span>
              <span>{Math.round(analysis.confidenceScore * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Predicted Concerns */}
      {analysis.predictedConcerns.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Predicted Concerns
              <Badge variant="secondary" className="ml-auto text-xs">
                {analysis.predictedConcerns.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {analysis.predictedConcerns.map((concern, i) => (
              <div key={i} className="space-y-1.5">
                {i > 0 && <Separator className="my-3" />}
                <div className="flex items-start gap-2">
                  <SeverityBadge severity={concern.severity} />
                  <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                    {concern.category}
                  </Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {Math.round(concern.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{concern.concern}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Likely Questions */}
      {analysis.likelyQuestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              Likely Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {analysis.likelyQuestions.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground mt-0.5 shrink-0">›</span>
                  <span>&ldquo;{q}&rdquo;</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Rationale Gaps */}
      {analysis.rationaleGaps.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-orange-500" />
              Rationale Gaps
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                — prepare answers before the review
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {analysis.rationaleGaps.map((gap, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* All clear */}
      {analysis.predictedConcerns.length === 0 &&
        analysis.likelyQuestions.length === 0 &&
        analysis.rationaleGaps.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium">No significant concerns detected</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            This reviewer has no strong historical signals against this design direction.
          </p>
        </div>
      )}
    </div>
  );
}
