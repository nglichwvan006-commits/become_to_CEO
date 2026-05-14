"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ParticleBackground } from "@/components/animations/particle-background";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Rocket } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    if (!supabase) {
      toast.success("Dang ky demo thanh cong", {
        description: "Supabase chua cau hinh, tam thoi vao dashboard bang demo mode.",
      });
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      toast.error("Đăng ký thất bại", {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success("Đăng ký thành công! 🎉", {
      description: "Chào mừng bạn đến với Career Quest RPG!",
    });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <ParticleBackground count={40} palette="career" />

      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-strong border-border/30 shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg"
            >
              <Rocket className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              <span className="text-gradient-pink">Bắt Đầu Hành Trình</span>
            </CardTitle>
            <CardDescription>
              Tạo tài khoản và bắt đầu từ vị trí Intern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Tên hiển thị
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" /> Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                variant="game"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Tạo Tài Khoản <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Career path preview */}
            <div className="mt-6 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Lộ trình sự nghiệp của bạn
              </p>
              <div className="flex items-center justify-center gap-1 text-sm">
                {["🌱", "💻", "⚡", "🔥", "👑", "🏗️", "🚀"].map((icon, i) => (
                  <span key={i} className="flex items-center">
                    <span className={i === 0 ? "text-lg" : "text-xs opacity-50"}>
                      {icon}
                    </span>
                    {i < 6 && (
                      <span className="text-muted-foreground/30 mx-0.5">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
