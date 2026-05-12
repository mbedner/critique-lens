"use client";

import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-5 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <div className="flex flex-1 items-center justify-between gap-6 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0"
        >
          <h1 className="text-[15px] font-semibold leading-none tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground truncate">{description}</p>
          )}
        </motion.div>
        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 shrink-0"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </header>
  );
}
