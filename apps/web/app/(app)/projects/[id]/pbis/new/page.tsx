import { PageHeader } from "@/components/layout/page-header";
import { PbiForm } from "@/components/projects/pbi-form";

export default async function NewPbiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageHeader title="New PBI" description="Define a problem brief for preflight analysis" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <PbiForm projectId={id} />
        </div>
      </main>
    </>
  );
}
