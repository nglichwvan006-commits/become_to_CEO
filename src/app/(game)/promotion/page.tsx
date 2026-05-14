"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { GlowPulse } from "@/components/animations/glow-pulse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CAREER_LEVELS } from "@/constants/career-levels";
import { useCareerStore } from "@/stores/career-store";
import { checkPromotionEligibility } from "@/lib/gamification";
import { TrendingUp, Lock, CheckCircle, ArrowRight, Zap, PartyPopper } from "lucide-react";

export default function PromotionPage() {
  const career = useCareerStore();
  const [promoting, setPromoting] = useState(false);
  const [promoted, setPromoted] = useState(false);

  const currentLevel = CAREER_LEVELS.find((l) => l.slug === career.careerLevelSlug) || CAREER_LEVELS[0];
  const nextLevel = CAREER_LEVELS.find((l) => l.orderIndex === currentLevel.orderIndex + 1);
  const isMaxLevel = !nextLevel;

  const eligibility = checkPromotionEligibility(
    career.tasksCompleted,
    career.performanceScore,
    career.careerLevelSlug
  );

  const requirements = nextLevel
    ? [
        {
          label: "Nhiệm vụ hoàn thành",
          current: career.tasksCompleted,
          target: nextLevel.requiredTasks,
          met: career.tasksCompleted >= nextLevel.requiredTasks,
        },
        {
          label: "Hiệu suất tối thiểu",
          current: career.performanceScore,
          target: nextLevel.minPerformanceScore,
          met: career.performanceScore >= nextLevel.minPerformanceScore,
          suffix: "%",
        },
      ]
    : [];

  const handlePromote = () => {
    setPromoting(true);
    setTimeout(() => {
      const success = career.promoteCareer();
      setPromoting(false);
      if (success) {
        setPromoted(true);
        setTimeout(() => setPromoted(false), 4000);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-violet-500" /> Thăng Cấp
          </h1>
          <p className="text-sm text-muted-foreground">
            Đáp ứng yêu cầu và vượt qua bài thi để thăng cấp sự nghiệp
          </p>
        </div>
      </FadeIn>

      {/* Promotion success animation */}
      {promoted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border-2 border-primary bg-primary/10 p-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.6 }}
            className="text-5xl mb-3"
          >
            <PartyPopper className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-xl font-bold text-primary mb-1">🎉 Thăng cấp thành công!</h2>
          <p className="text-sm text-muted-foreground">
            Chúc mừng bạn đã trở thành {CAREER_LEVELS.find((l) => l.slug === career.careerLevelSlug)?.name}!
          </p>
        </motion.div>
      )}

      {/* Current → Next */}
      <FadeIn delay={0.1}>
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl mb-2">{currentLevel.badgeIcon}</div>
                <h3 className="font-bold">{currentLevel.name}</h3>
                <Badge variant="career" className="mt-1">Hiện tại</Badge>
              </div>
              {nextLevel && (
                <>
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <GlowPulse color={nextLevel.badgeColor} intensity="medium">
                      <div className="text-4xl mb-2 rounded-full p-3">{nextLevel.badgeIcon}</div>
                    </GlowPulse>
                    <h3 className="font-bold">{nextLevel.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lương: {new Intl.NumberFormat("vi-VN").format(nextLevel.salary)}đ
                    </p>
                  </div>
                </>
              )}
              {isMaxLevel && (
                <div className="text-center">
                  <div className="text-4xl mb-2">👑</div>
                  <h3 className="font-bold text-primary">Cấp cao nhất!</h3>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Requirements */}
      {!isMaxLevel && (
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Yêu Cầu Thăng Cấp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-4">
                  {req.met ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={req.met ? "text-emerald-500" : ""}>{req.label}</span>
                      <span className="font-medium">{req.current}/{req.target}{req.suffix || ""}</span>
                    </div>
                    <Progress
                      value={Math.min((req.current / req.target) * 100, 100)}
                      className="h-2"
                      indicatorClassName={req.met ? "bg-emerald-500" : "bg-primary"}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Promotion action */}
      {!isMaxLevel && (
        <FadeIn delay={0.3}>
          <Card className="border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2">Bài Thi Thăng Cấp</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                {eligibility.eligible
                  ? `Bạn đã đủ điều kiện! Nhấn nút bên dưới để thăng cấp lên ${nextLevel?.name}.`
                  : `Hoàn thành yêu cầu để mở khóa thăng cấp lên ${nextLevel?.name}. Bài thi gồm: ${nextLevel?.skills.join(", ")}.`
                }
              </p>
              {eligibility.missing.length > 0 && (
                <div className="mb-4 space-y-1">
                  {eligibility.missing.map((m, i) => (
                    <p key={i} className="text-xs text-amber-500">⚠️ {m}</p>
                  ))}
                </div>
              )}
              <Button
                variant="career"
                size="lg"
                disabled={!eligibility.eligible || promoting}
                onClick={handlePromote}
              >
                {promoting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    {eligibility.eligible ? "Thăng Cấp Ngay!" : "Chưa đủ điều kiện"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Career path */}
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Toàn Bộ Lộ Trình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CAREER_LEVELS.map((level) => {
                const isCurrent = level.slug === career.careerLevelSlug;
                const isNext = level.orderIndex === currentLevel.orderIndex + 1;
                const isPast = level.orderIndex < currentLevel.orderIndex;
                const isFuture = level.orderIndex > currentLevel.orderIndex + 1;

                return (
                  <div
                    key={level.id}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      isCurrent
                        ? "bg-primary/10 ring-1 ring-primary/20"
                        : isPast
                        ? "bg-emerald-500/5 border border-emerald-500/20"
                        : isNext
                        ? "bg-muted/80"
                        : "bg-muted/30 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{level.badgeIcon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{level.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Intl.NumberFormat("vi-VN").format(level.salary)}đ/tháng
                      </p>
                    </div>
                    {isCurrent && <Badge variant="career">Hiện tại</Badge>}
                    {isPast && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    {isNext && <Badge variant="secondary">Tiếp theo</Badge>}
                    {isFuture && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
