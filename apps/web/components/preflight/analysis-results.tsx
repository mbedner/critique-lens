"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { AlertTriangle, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, FadeUp, easeOutExpo } from "@/components/ui/motion";
import type { PreflightAnalysis } from "@/types";

interface AnalysisResultsProps {
  analysis: PreflightAnalysis;
  reviewerName?: string;
  pbiTitle?: string;
}

function ReadinessGauge({ score }: { score: number }) {
  const color =
    score >= 75 ? "text-emerald-600" :
    score >= 50 ? "text-amber-500" :
    "text-red-500";
  const badgeClass =
    score >= 75
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : score >= 50
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-red-200 bg-red-50 text-red-700";
  const label = score >= 75 ? "Review Ready" : score >= 50 ? "Needs Work" : "Not Ready";

  // Arc progress indicator
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
      <div className="relative flex items-center justify-center">
        <svg width="88" height="88" className="-rotate-90">
          <circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/60"
          />
          <motion.circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            className={color}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-2xl font-bold tabular-nums leading-none", color)}>
            <CountUp to={score} duration={1.4} />
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">/ 100</span>
        </div>
      </div>
      <Badge variant="outline" className={cn("text-xs font-medium", badgeClass)}>
        {label}
      </Badge>
    </div>
  );
}

export function AnalysisResults({ analysis, reviewerName, pbiTitle }: AnalysisResultsProps) {
  return (
    <div className="space-y-5">
      {/* Summary Row */}
      <FadeUp delay={0}>
        <div className="flex flex-wrap items-start gap-5 rounded-xl border bg-card p-5 shadow-sm">
          {analysis.readinessScore !== null && analysis.readinessScore !== undefined && (
            <ReadinessGauge score={analysis.readinessScore} />
          )}
          <Separator orientation="vertical" className="h-20 hidden sm:block self-center" />
          <div className="flex-1 space-y-1.5">
            {reviewerName && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-20 shrink-0">Reviewer</span>
                <span className="font-medium">{reviewerName}</span>
              </div>
            )}
            {pbiTitle && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-20 shrink-0">PBI</span>
                <span className="font-medium">{pbiTitle}</span>
              </div>
            )}
            {analysis.frameName && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-20 shrink-0">Frame</span>
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{analysis.frameName}</span>
              </div>
            )}
            {analysis.confidenceScore !== null && analysis.confidenceScore !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-20 shrink-0">Confidence</span>
                <span className="font-medium">{Math.round(analysis.confidenceScore * 100)}%</span>
              </div>
            )}
          </div>
        </div>
      </FadeUp>

      {/* Predicted Concerns */}
      {analysis.predictedConcerns.length > 0 && (
        <FadeUp delay={0.1}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Predicted Concerns
                <Badge variant="secondary" className="ml-auto text-xs font-medium">
                  {analysis.predictedConcerns.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {analysis.predictedConcerns.map((concern, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.32, delay: 0.15 + i * 0.06, ease: easeOutExpo }}
                  className="space-y-1.5"
                >
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={concern.severity} />
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                      {concern.category}
                    </Badge>
                    <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                      {Math.round(concern.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{concern.concern}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* Likely Questions */}
      {analysis.likelyQuestions.length > 0 && (
        <FadeUp delay={0.18}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <HelpCircle className="h-4 w-4 text-[var(--violet)]" />
                Likely Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2.5">
                {analysis.likelyQuestions.map((q, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.22 + i * 0.055, ease: easeOutExpo }}
                    className="flex gap-2.5 text-sm"
                  >
                    <span className="text-[var(--violet)] mt-0.5 shrink-0 font-medium">›</span>
                    <span className="leading-relaxed">&ldquo;{q}&rdquo;</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* Rationale Gaps */}
      {analysis.rationaleGaps.length > 0 && (
        <FadeUp delay={0.26}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-orange-500" />
                Rationale Gaps
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  — prepare before the review
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2.5">
                {analysis.rationaleGaps.map((gap, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.055, ease: easeOutExpo }}
                    className="flex gap-2.5 text-sm"
                  >
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    <span className="leading-relaxed">{gap}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* All clear */}
      {analysis.predictedConcerns.length === 0 &&
        analysis.likelyQuestions.length === 0 &&
        analysis.rationaleGaps.length === 0 && (
          <FadeUp delay={0.1}>
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
              >
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <p className="text-sm font-semibold">No significant concerns detected</p>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                This reviewer has no strong historical signals against this design direction.
              </p>
            </div>
          </FadeUp>
        )}
    </div>
  );
}
