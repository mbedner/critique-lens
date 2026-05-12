import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-5 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <div className="flex flex-1 items-center justify-between gap-6 min-w-0">
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-none tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
