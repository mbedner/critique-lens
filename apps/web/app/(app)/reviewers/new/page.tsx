import { PageHeader } from "@/components/layout/page-header";
import { ReviewerForm } from "@/components/reviewers/reviewer-form";

export default function NewReviewerPage() {
  return (
    <>
      <PageHeader
        title="New Reviewer"
        description="Create a reviewer profile to build a persona from critique history"
      />
      <main className="flex-1 p-6">
        <div className="max-w-2xl">
          <ReviewerForm />
        </div>
      </main>
    </>
  );
}
