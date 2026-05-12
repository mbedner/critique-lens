import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

const severityConfig: Record<Severity, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400" },
  high: { label: "High", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { label, className } = severityConfig[severity];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", className)}>
      {label}
    </Badge>
  );
}
