"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Lock, CheckCircle } from "lucide-react";

const DEMO_ACHIEVEMENTS = [
  { id: "1", name: "First Commit", description: "Hoàn thành nhiệm vụ đầu tiên", icon: "🎯", category: "Khởi đầu", unlocked: true, progress: 1, target: 1 },
  { id: "2", name: "3-Day Streak", description: "Duy trì streak 3 ngày liên tiếp", icon: "🔥", category: "Streak", unlocked: true, progress: 3, target: 3 },
  { id: "3", name: "7-Day Streak", description: "Duy trì streak 7 ngày liên tiếp", icon: "💪", category: "Streak", unlocked: false, progress: 5, target: 7 },
  { id: "4", name: "Bug Hunter", description: "Hoàn thành 10 bài Bug Fix", icon: "🐛", category: "Chuyên môn", unlocked: false, progress: 3, target: 10 },
  { id: "5", name: "Clean Code Master", description: "Hoàn thành 5 bài Refactor", icon: "✨", category: "Chuyên môn", unlocked: false, progress: 1, target: 5 },
  { id: "6", name: "Speed Demon", description: "Hoàn thành 10 nhiệm vụ trước deadline", icon: "⚡", category: "Hiệu suất", unlocked: false, progress: 7, target: 10 },
  { id: "7", name: "Senior Engineer", description: "Đạt cấp Senior Developer", icon: "🔥", category: "Sự nghiệp", unlocked: false, progress: 0, target: 1 },
  { id: "8", name: "Future CTO", description: "Đạt cấp CTO", icon: "🚀", category: "Sự nghiệp", unlocked: false, progress: 0, target: 1 },
  { id: "9", name: "Task Machine", description: "Hoàn thành 50 nhiệm vụ", icon: "⚙️", category: "Số lượng", unlocked: false, progress: 8, target: 50 },
  { id: "10", name: "Perfect Week", description: "Hoàn thành tất cả daily quest trong 7 ngày", icon: "🌟", category: "Hoàn hảo", unlocked: false, progress: 2, target: 7 },
];

export default function AchievementsPage() {
  const unlocked = DEMO_ACHIEVEMENTS.filter((a) => a.unlocked);
  const locked = DEMO_ACHIEVEMENTS.filter((a) => !a.unlocked);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-500" /> Thành Tựu
            </h1>
            <p className="text-sm text-muted-foreground">
              {unlocked.length}/{DEMO_ACHIEVEMENTS.length} đã mở khóa
            </p>
          </div>
          <Badge variant="gold">{unlocked.length} mở khóa</Badge>
        </div>
      </FadeIn>

      {/* Progress overview */}
      <FadeIn delay={0.1}>
        <div className="space-y-1.5">
          <Progress value={(unlocked.length / DEMO_ACHIEVEMENTS.length) * 100} className="h-2.5" indicatorClassName="bg-gradient-to-r from-amber-500 to-yellow-400" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round((unlocked.length / DEMO_ACHIEVEMENTS.length) * 100)}% hoàn thành
          </p>
        </div>
      </FadeIn>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Đã mở khóa</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {unlocked.map((ach, i) => (
              <FadeIn key={ach.id} delay={0.15 + i * 0.05}>
                <Card className="group border-amber-500/20 bg-amber-500/5">
                  <CardContent className="p-4 flex items-center gap-4">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="text-3xl">
                      {ach.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{ach.name}</h3>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">{ach.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Chưa mở khóa</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {locked.map((ach, i) => (
            <FadeIn key={ach.id} delay={0.2 + i * 0.05}>
              <Card className="group opacity-75 hover:opacity-100 transition-opacity">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <span className="text-3xl grayscale">{ach.icon}</span>
                    <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{ach.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{ach.description}</p>
                    <Progress value={(ach.progress / ach.target) * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{ach.progress}/{ach.target}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
