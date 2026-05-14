"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { RewardToast } from "@/components/game/reward-toast";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
      <RewardToast />
    </div>
  );
}
