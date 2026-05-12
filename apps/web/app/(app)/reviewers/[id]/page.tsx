import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewerDetail } from "@/components/reviewers/reviewer-detail";
import type { Reviewer } from "@/types";

async function getReviewer(id: string): Promise<Reviewer | null> {
  // TODO: replace with db query
  return null;
}

export default async function ReviewerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviewer = await getReviewer(id);
  if (!reviewer) notFound();

  return (
    <>
      <PageHeader title={reviewer.name} description="Reviewer profile and persona" />
      <main className="flex-1 p-6">
        <div className="max-w-3xl">
          <ReviewerDetail reviewer={reviewer} />
        </div>
      </main>
    </>
  );
}
