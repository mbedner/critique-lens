import { Plus, MessageSquare } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeader } from "@/components/layout/page-header";
import { CritiqueCard } from "@/components/critiques/critique-card";
import { CritiqueSearch } from "@/components/critiques/critique-search";
import { EmptyState } from "@/components/shared/empty-state";
import type { Critique } from "@/types";

async function getCritiques(_query?: string): Promise<Critique[]> {
  // TODO: replace with db query (+ vector search when query is set)
  return [];
}

export default async function CritiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const critiques = await getCritiques(q);

  return (
    <>
      <PageHeader
        title="Critique Memory"
        description="Search and browse your review history"
        actions={
          <div className="flex items-center gap-2">
            <CritiqueSearch />
            <LinkButton href="/critiques/new" size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Critique
            </LinkButton>
          </div>
        }
      />
      <main className="flex-1 p-6">
        {q && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing results for <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
          </p>
        )}
        {critiques.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={q ? "No critiques found" : "No critiques yet"}
            description={
              q
                ? "Try a different search term."
                : "Upload critique notes, Slack messages, or meeting notes to start building your review memory."
            }
            action={
              !q ? (
                <LinkButton href="/critiques/new" size="sm">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add first critique
                </LinkButton>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {critiques.map((critique) => (
              <CritiqueCard key={critique.id} critique={critique} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
