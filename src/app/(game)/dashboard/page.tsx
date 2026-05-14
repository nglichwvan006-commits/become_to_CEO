"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { GlowPulse } from "@/components/animations/glow-pulse";
import { Card, CardContent, CardHeader, CardTitle, GlassCard } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CAREER_LEVELS } from "@/constants/career-levels";
import { GAME_CONFIG } from "@/constants/game-config";
import { formatCurrency, calculateRequiredExp, getExpProgress } from "@/lib/utils";
import { useCareerStore } from "@/stores/career-store";
import {
  TrendingUp, Trophy, Flame, Target,
  AlertTriangle, CheckCircle, Star, DollarSign, Award,
  ChevronRight, Zap, Calendar,
} from "lucide-react";
import Link from "next/link";

function DemotionRiskMeter({ risk }: { risk: number }) {
  const color = risk < 30 ? "var(--risk-safe)" : risk < 70 ? "var(--risk-warning)" : "var(--risk-danger)";
  const label = risk < 30 ? "An toàn" : risk < 70 ? "Cần chú ý" : "Nguy hiểm!";
  const animClass = risk < 30 ? "animate-risk-safe" : risk < 70 ? "animate-risk-warning" : "animate-risk-danger";

  return (
    <div className={`rounded-xl p-4 border ${animClass}`} style={{ borderColor: color + "40" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" style={{ color }} />
          <span className="text-sm font-medium">Nguy Cơ Giáng Chức</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${risk}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        {risk < 30 ? "Hiệu suất tốt. Tiếp tục phát huy!" : risk < 70 ? "Cần hoàn thành thêm nhiệm vụ đúng hạn." : "Cần hành động ngay! Nguy cơ bị giáng chức."}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const career = useCareerStore();

  // Update daily streak on page load
  useEffect(() => {
    career.updateDailyStreak();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const careerLevel = CAREER_LEVELS.find((l) => l.slug === career.careerLevelSlug) || CAREER_LEVELS[0];
  const nextLevel = CAREER_LEVELS.find((l) => l.orderIndex === careerLevel.orderIndex + 1);
  const requiredExp = calculateRequiredExp(career.level);
  const expProgress = getExpProgress(career.exp, career.level);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Chào mừng trở lại! Hãy tiếp tục hành trình sự nghiệp.</p>
          </div>
          <Link href="/tasks">
            <Button variant="career" size="sm">
              <Zap className="h-4 w-4" /> Làm Nhiệm Vụ
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Top row — Career info + Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Career Card */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <GlowPulse color={careerLevel.badgeColor} intensity="low">
            <GlassCard className="p-6">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg"
                  style={{ backgroundColor: careerLevel.badgeColor + "20" }}
                >
                  {careerLevel.badgeIcon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{careerLevel.name}</h2>
                    <Badge variant="career">Cấp {career.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{careerLevel.description}</p>

                  {/* EXP Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">EXP</span>
                      <span className="font-medium">{career.exp} / {requiredExp}</span>
                    </div>
                    <Progress
                      value={expProgress}
                      className="h-2.5"
                      indicatorClassName="bg-gradient-to-r from-violet-500 to-indigo-500"
                    />
                  </div>

                  {/* Next level info */}
                  {nextLevel && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>Tiếp theo: {nextLevel.name} — Cần {nextLevel.requiredTasks} nhiệm vụ</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </GlowPulse>
        </FadeIn>

        {/* Quick Stats */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 gap-3 h-full">
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <DollarSign className="h-5 w-5 text-amber-500 mb-1" />
              <p className="text-lg font-bold text-gradient-gold">{formatCurrency(career.salary)}</p>
              <p className="text-[10px] text-muted-foreground">Lương/tháng</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <Star className="h-5 w-5 text-violet-500 mb-1" />
              <p className="text-lg font-bold text-gradient-purple">{career.reputation}</p>
              <p className="text-[10px] text-muted-foreground">Danh tiếng</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <Target className="h-5 w-5 text-emerald-500 mb-1" />
              <p className="text-lg font-bold text-gradient-green">{career.performanceScore}%</p>
              <p className="text-[10px] text-muted-foreground">Hiệu suất</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <Flame className="h-5 w-5 text-orange-500 mb-1" />
              <p className="text-lg font-bold text-gradient-fire">{career.streak}</p>
              <p className="text-[10px] text-muted-foreground">Streak ngày</p>
            </Card>
          </div>
        </FadeIn>
      </div>

      {/* Middle row — Demotion Risk + KPI + Rank */}
      <div className="grid gap-6 lg:grid-cols-3">
        <FadeIn delay={0.3}>
          <DemotionRiskMeter risk={career.demotionRisk} />
        </FadeIn>

        <FadeIn delay={0.35}>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">KPI Tiến Độ</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Nhiệm vụ hoàn thành</span>
                  <span className="font-medium">{career.tasksCompleted}/{nextLevel?.requiredTasks || 10}</span>
                </div>
                <Progress value={(career.tasksCompleted / (nextLevel?.requiredTasks || 10)) * 100} className="h-2" indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-400" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Đúng hạn</span>
                  <span className="font-medium">{career.tasksOnTime}/{career.tasksCompleted}</span>
                </div>
                <Progress value={career.tasksCompleted > 0 ? (career.tasksOnTime / career.tasksCompleted) * 100 : 0} className="h-2" indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-400" />
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Rank</span>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-1">
                {GAME_CONFIG.rankTiers.find((r) => r.tier === career.rankTier)?.icon || "🥉"}
              </div>
              <p className="font-bold text-sm">
                {GAME_CONFIG.rankTiers.find((r) => r.tier === career.rankTier)?.label || "Đồng"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {career.reputation} điểm danh tiếng
              </p>
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* Bottom row — Daily Quests + Recent Achievements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn delay={0.5}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Nhiệm Vụ Hàng Ngày
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {career.dailyQuests.filter((q) => q.completed).length}/{career.dailyQuests.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {career.dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-center gap-3 rounded-lg p-3 bg-muted/50"
                >
                  {quest.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${quest.completed ? "line-through text-muted-foreground" : "font-medium"}`}>
                      {quest.title}
                    </p>
                    <Progress
                      value={(quest.current / quest.target) * 100}
                      className="h-1 mt-1.5"
                      indicatorClassName={quest.completed ? "bg-emerald-500" : "bg-primary"}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {quest.current}/{quest.target}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.55}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" /> Thành Tựu Gần Đây
                </CardTitle>
                <Link href="/achievements">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Xem tất cả <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {career.recentAchievements.map((ach, i) => (
                <motion.div
                  key={`${ach.name}-${i}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 rounded-lg p-3 bg-muted/50"
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ach.name}</p>
                    <p className="text-xs text-muted-foreground">{ach.unlockedAt}</p>
                  </div>
                </motion.div>
              ))}
              {career.recentAchievements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có thành tựu nào. Hãy bắt đầu làm nhiệm vụ!
                </p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
