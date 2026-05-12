import { notFound } from "next/navigation";
import Link from "next/link";
import { RiArrowLeftLine, RiAddLine } from "@remixicon/react";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeader } from "@/components/layout/page-header";
import { AnalysisResults } from "@/components/preflight/analysis-results";
import type { PreflightAnalysis } from "@/types";

async function getAnalysis(id: string): Promise<PreflightAnalysis | null> {
  // TODO: replace with db query
  return null;
}

export default async function PreflightResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const analysis = await getAnalysis(id);
  if (!analysis) notFound();

  return (
    <>
      <PageHeader
        title={analysis.frameName ?? "Analysis"}
        description="Preflight critique results"
        actions={
          <LinkButton href="/preflight/new" size="sm" variant="outline">
            <RiAddLine className="h-4 w-4 mr-1.5" />
            New Analysis
          </LinkButton>
        }
      />
      <main className="flex-1 p-6">
        <div className="max-w-3xl space-y-4">
          <Link
            href="/preflight"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RiArrowLeftLine className="h-3 w-3" />
            All analyses
          </Link>

          {analysis.frameImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={analysis.frameImageUrl}
              alt={analysis.frameName ?? "Frame"}
              className="max-h-64 w-full rounded-lg border object-contain bg-muted/30"
            />
          )}

          <AnalysisResults analysis={analysis} />
        </div>
      </main>
    </>
  );
}
