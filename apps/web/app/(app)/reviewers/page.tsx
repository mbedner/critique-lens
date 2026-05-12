import { Plus, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewerCard } from "@/components/reviewers/reviewer-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageShell } from "@/components/ui/motion";
import type { Reviewer } from "@/types";

async function getReviewers(): Promise<Reviewer[]> {
  // TODO: replace with db query once DB is connected
  return [];
}

export default async function ReviewersPage() {
  const reviewers = await getReviewers();

  return (
    <>
      <PageHeader
        title="Reviewers"
        description="Build and manage reviewer personas from critique history"
        actions={
          <LinkButton href="/reviewers/new" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Reviewer
          </LinkButton>
        }
      />
      <PageShell className="p-6">
        {reviewers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6 text-[var(--violet)]" />}
            title="No reviewers yet"
            description="Create reviewer profiles to start building personas from your critique history."
            action={
              <LinkButton href="/reviewers/new" size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Add first reviewer
              </LinkButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviewers.map((reviewer, i) => (
              <ReviewerCard key={reviewer.id} reviewer={reviewer} index={i} />
            ))}
          </div>
        )}
      </PageShell>
    </>
  );
}
