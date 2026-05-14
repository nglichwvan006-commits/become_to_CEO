"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const supabase = createClient();

    if (!supabase) {
      setSent(true);
      setLoading(false);
      toast.success("Demo mode", {
        description: "Supabase chua cau hinh nen email reset khong duoc gui.",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error("Khong gui duoc email reset", {
        description: error.message,
      });
      return;
    }

    setSent(true);
    toast.success("Da gui email reset mat khau");
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
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-violet-600 shadow-lg"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              <span className="text-gradient-career">Reset Password</span>
            </CardTitle>
            <CardDescription>
              Nhap email de nhan lien ket dat lai mat khau.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetRequest} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                variant="career"
                className="w-full"
                size="lg"
                disabled={loading || sent}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    {sent ? "Kiem tra email" : "Gui link reset"}
                    <Send className="h-4 w-4" />
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
