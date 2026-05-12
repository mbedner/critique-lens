import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewerForm } from "@/components/reviewers/reviewer-form";
import type { Reviewer } from "@/types";

async function getReviewer(id: string): Promise<Reviewer | null> {
  // TODO: replace with db query
  return null;
}

export default async function EditReviewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviewer = await getReviewer(id);
  if (!reviewer) notFound();

  return (
    <>
      <PageHeader title={`Edit ${reviewer.name}`} />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <ReviewerForm defaultValues={reviewer} reviewerId={id} />
        </div>
      </main>
    </>
  );
}
