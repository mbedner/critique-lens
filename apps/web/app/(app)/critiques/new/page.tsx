import { PageHeader } from "@/components/layout/page-header";
import { CritiqueForm } from "@/components/critiques/critique-form";
import type { Reviewer, Project, Pbi } from "@/types";

async function getData(): Promise<{ reviewers: Reviewer[]; projects: Project[]; pbis: Pbi[] }> {
  // TODO: replace with db queries
  return { reviewers: [], projects: [], pbis: [] };
}

export default async function NewCritiquePage() {
  const { reviewers, projects, pbis } = await getData();

  return (
    <>
      <PageHeader
        title="Add Critique"
        description="Record a critique to build your review memory"
      />
      <main className="flex-1 p-6">
        <div className="max-w-2xl">
          <CritiqueForm reviewers={reviewers} projects={projects} pbis={pbis} />
        </div>
      </main>
    </>
  );
}
