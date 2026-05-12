import { PageHeader } from "@/components/layout/page-header";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="New Project" />
      <main className="flex-1 p-6">
        <div className="max-w-xl">
          <ProjectForm />
        </div>
      </main>
    </>
  );
}
