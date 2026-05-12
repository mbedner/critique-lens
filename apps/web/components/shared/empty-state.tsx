"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/components/ui/motion";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-20 text-center", className)}>
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--violet-light)] ring-1 ring-[var(--violet)]/15">
          {icon}
        </div>
        {/* Glow ring that pulses */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl ring-1 ring-[var(--violet)]/30"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
        className="space-y-1.5"
      >
        <p className="text-[15px] font-semibold tracking-tight">{title}</p>
        <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">{description}</p>
      </motion.div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: easeOutExpo }}
          className="mt-1"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
