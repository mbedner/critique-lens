"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, MessageSquare, Zap, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/reviewers", label: "Reviewers", icon: Users },
  { href: "/critiques", label: "Critique Memory", icon: MessageSquare },
  { href: "/preflight", label: "Preflight", icon: Zap },
  { href: "/projects", label: "Projects & PBIs", icon: FolderOpen },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="sidebar-dark border-r-0">
      <SidebarHeader className="px-5 py-5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/10">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-white">
            Critique Lens
          </span>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="gap-0.5">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-1">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.05 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={active}
                        className={cn(
                          "relative h-8 rounded-md px-3 text-[13px] transition-colors duration-150",
                          active
                            ? "text-white font-medium"
                            : "text-white/55 hover:bg-white/6 hover:text-white/85"
                        )}
                        render={<Link href={item.href} />}
                      >
                        {active && (
                          <motion.span
                            layoutId="active-nav-pill"
                            className="absolute inset-0 rounded-md bg-white/10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" />
                        <span className="relative z-10">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-5 py-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[11px] text-white/20 tracking-wide"
        >
          Design Intelligence System
        </motion.p>
      </SidebarFooter>
    </Sidebar>
  );
}
