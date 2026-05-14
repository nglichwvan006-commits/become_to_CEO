"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { ThemeToggle } from "./theme-toggle";
import {
  LayoutDashboard,
  ListTodo,
  Trophy,
  Award,
  PawPrint,
  TrendingUp,
  Calendar,
  Shield,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Nhiệm Vụ", icon: ListTodo },
  { href: "/leaderboard", label: "Bảng Xếp Hạng", icon: Trophy },
  { href: "/achievements", label: "Thành Tựu", icon: Award },
  { href: "/pets", label: "Thú Cưng", icon: PawPrint },
  { href: "/promotion", label: "Thăng Cấp", icon: TrendingUp },
  { href: "/seasons", label: "Mùa Giải", icon: Calendar },
];

const ADMIN_ITEMS = [
  { href: "/admin", label: "Quản Trị", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-sidebar transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {sidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gradient-career">
                Career Quest
              </span>
              <span className="text-[10px] text-muted-foreground">
                Từ Intern đến CTO
              </span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 shrink-0"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary font-medium shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-sidebar-border" />

        {ADMIN_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-center gap-2">
          <ThemeToggle />
          {sidebarOpen && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>v1.0</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
