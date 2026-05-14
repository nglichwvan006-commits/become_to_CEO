"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";
import { ParticleBackground } from "@/components/animations/particle-background";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Mat khau qua ngan", {
        description: "Hay dung toi thieu 8 ky tu.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mat khau khong khop");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (!supabase) {
      toast.success("Demo mode", {
        description: "Supabase chua cau hinh, reset password duoc gia lap.",
      });
      router.push("/login");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("Khong cap nhat duoc mat khau", {
        description: error.message,
      });
      return;
    }

    toast.success("Da cap nhat mat khau");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <ParticleBackground count={40} palette="career" />

      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-strong border-border/30 shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg"
            >
              <KeyRound className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              <span className="text-gradient-career">New Password</span>
            </CardTitle>
            <CardDescription>
              Chon mat khau moi cho tai khoan Career Quest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" /> Mat khau moi
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Toi thieu 8 ky tu"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" /> Xac nhan mat khau
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Nhap lai mat khau moi"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                variant="career"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Cap nhat mat khau <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lai dang nhap
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
