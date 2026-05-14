"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCareerStore } from "@/stores/career-store";
import { Zap, TrendingUp, DollarSign, Star, Award } from "lucide-react";

export function RewardToast() {
  const { lastReward, resetLastReward } = useCareerStore();

  useEffect(() => {
    if (lastReward) {
      const timer = setTimeout(resetLastReward, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastReward, resetLastReward]);

  return (
    <AnimatePresence>
      {lastReward && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 min-w-[280px]"
        >
          <div className="rounded-xl border border-primary/30 bg-card shadow-2xl shadow-primary/10 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {lastReward.leveledUp ? "🎉 Level Up!" : "✅ Nhiệm vụ hoàn thành!"}
                </p>
                {lastReward.leveledUp && (
                  <p className="text-xs text-primary font-medium">
                    Lên cấp {lastReward.newLevel}!
                  </p>
                )}
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <Zap className="h-3.5 w-3.5" />+{lastReward.expGained} EXP
              </span>
              {lastReward.salaryGained > 0 && (
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <DollarSign className="h-3.5 w-3.5" />+{lastReward.salaryGained.toLocaleString()}₫
                </span>
              )}
              {lastReward.reputationGained > 0 && (
                <span className="flex items-center gap-1 text-violet-500 font-semibold">
                  <Star className="h-3.5 w-3.5" />+{lastReward.reputationGained} Rep
                </span>
              )}
            </div>

            {/* Rank change */}
            {lastReward.rankChanged && (
              <div className="flex items-center gap-2 text-xs text-cyan-500 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Rank lên {lastReward.newRank}!
              </div>
            )}

            {/* Progress bar animation */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-0.5 rounded-full bg-primary/40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
