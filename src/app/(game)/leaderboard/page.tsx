"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CAREER_LEVELS } from "@/constants/career-levels";
import { GAME_CONFIG } from "@/constants/game-config";
import { Trophy, Flame, Target } from "lucide-react";

const DEMO_LEADERBOARD = [
  { rank: 1, name: "Phạm Minh Đức", careerLevel: "senior", score: 2850, streak: 45, tasksCompleted: 67, onTimeRate: 95 },
  { rank: 2, name: "Nguyễn Thu Hà", careerLevel: "tech-lead", score: 2720, streak: 38, tasksCompleted: 61, onTimeRate: 92 },
  { rank: 3, name: "Trần Hoàng Nam", careerLevel: "middle", score: 2100, streak: 22, tasksCompleted: 43, onTimeRate: 88 },
  { rank: 4, name: "Lê Thanh Tùng", careerLevel: "junior", score: 1450, streak: 15, tasksCompleted: 28, onTimeRate: 85 },
  { rank: 5, name: "Võ Thị Mai", careerLevel: "junior", score: 1200, streak: 12, tasksCompleted: 24, onTimeRate: 83 },
  { rank: 6, name: "Đỗ Quang Huy", careerLevel: "intern", score: 680, streak: 8, tasksCompleted: 15, onTimeRate: 80 },
  { rank: 7, name: "Bùi Thị Lan", careerLevel: "intern", score: 450, streak: 5, tasksCompleted: 10, onTimeRate: 90 },
  { rank: 8, name: "Hoàng Văn An", careerLevel: "intern", score: 320, streak: 3, tasksCompleted: 8, onTimeRate: 75 },
];

const RANK_COLORS = ["text-amber-400", "text-gray-400", "text-amber-700"];

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" /> Bảng Xếp Hạng
          </h1>
          <p className="text-sm text-muted-foreground">
            Xếp hạng theo điểm hiệu suất, nhiệm vụ hoàn thành và streak
          </p>
        </div>
      </FadeIn>

      {/* Top 3 podium */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 0, 2].map((idx) => {
            const player = DEMO_LEADERBOARD[idx];
            const career = CAREER_LEVELS.find((c) => c.slug === player.careerLevel);
            const isFirst = idx === 0;

            return (
              <motion.div
                key={player.rank}
                whileHover={{ y: -4 }}
                className={`glass rounded-xl p-4 text-center ${isFirst ? "ring-2 ring-amber-400/30 order-first col-span-3 sm:col-span-1 sm:order-none" : ""}`}
              >
                <div className={`text-3xl mb-2 ${RANK_COLORS[idx] || ""}`}>
                  {idx === 0 ? "👑" : idx === 1 ? "🥈" : "🥉"}
                </div>
                <Avatar className="mx-auto mb-2 h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold">
                    {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-sm">{player.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  {career?.badgeIcon} {career?.name}
                </p>
                <p className="text-lg font-bold text-gradient-gold mt-1">{player.score.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">điểm</p>
              </motion.div>
            );
          })}
        </div>
      </FadeIn>

      {/* Full ranking table */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bảng xếp hạng đầy đủ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DEMO_LEADERBOARD.map((player, i) => {
                const career = CAREER_LEVELS.find((c) => c.slug === player.careerLevel);
                const rankTier = GAME_CONFIG.rankTiers.filter((r) => player.score >= r.minScore).pop();

                return (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <span className={`w-8 text-center font-bold text-sm ${i < 3 ? "text-amber-500" : "text-muted-foreground"}`}>
                      #{player.rank}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                        {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{career?.badgeIcon} {career?.name}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" /> {player.streak}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-emerald-500" /> {player.tasksCompleted}
                      </span>
                      <span>{player.onTimeRate}%</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{player.score.toLocaleString()}</p>
                      <p className="text-[10px]">{rankTier?.icon} {rankTier?.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
