import { PageHeader } from "@/components/layout/page-header";
import { PreflightForm } from "@/components/preflight/preflight-form";
import type { Reviewer, Project, Pbi } from "@/types";

async function getData(): Promise<{ reviewers: Reviewer[]; projects: Project[]; pbis: Pbi[] }> {
  // TODO: replace with db queries
  return { reviewers: [], projects: [], pbis: [] };
}

export default async function NewPreflightPage() {
  const { reviewers, projects, pbis } = await getData();

  return (
    <>
      <PageHeader
        title="Preflight Critique"
        description="Analyze a frame against a reviewer persona before your review"
      />
      <main className="flex-1 p-6">
        <div className="max-w-2xl">
          <PreflightForm reviewers={reviewers} projects={projects} pbis={pbis} />
        </div>
      </main>
    </>
  );
}
