"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "./theme-toggle";
import { useUIStore } from "@/stores/ui-store";
import { toast } from "sonner";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();

    if (supabase) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Khong dang xuat duoc", {
          description: error.message,
        });
        return;
      }
    }

    toast.success("Da dang xuat");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block" />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          title="Dang xuat"
          aria-label="Dang xuat"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
