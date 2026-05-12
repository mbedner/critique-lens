import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import type { Project, Pbi } from "@/types";

async function getData(): Promise<{ projects: Project[]; pbis: Pbi[] }> {
  // TODO: replace with db queries
  return { projects: [], pbis: [] };
}

export default async function ProjectsPage() {
  const { projects, pbis } = await getData();

  return (
    <>
      <PageHeader
        title="Projects & PBIs"
        description="Organize critiques and analyses by project and problem brief"
        actions={
          <LinkButton href="/projects/new" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Project
          </LinkButton>
        }
      />
      <main className="flex-1 p-6">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create projects to organize critiques and PBIs for preflight analysis."
            action={
              <LinkButton href="/projects/new" size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Add first project
              </LinkButton>
            }
          />
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const projectPbis = pbis.filter((p) => p.projectId === project.id);
              return (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-medium">{project.name}</CardTitle>
                        {project.description && (
                          <p className="mt-1 text-xs text-muted-foreground">{project.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {projectPbis.length} PBI{projectPbis.length !== 1 ? "s" : ""}
                        </Badge>
                        <LinkButton
                          href={`/projects/${project.id}/pbis/new`}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add PBI
                        </LinkButton>
                      </div>
                    </div>
                  </CardHeader>
                  {projectPbis.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {projectPbis.map((pbi) => (
                          <Link
                            key={pbi.id}
                            href={`/projects/${project.id}/pbis/${pbi.id}`}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <span>{pbi.title}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(pbi.createdAt)}</span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
