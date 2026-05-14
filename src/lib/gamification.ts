import { CAREER_LEVELS } from "@/constants/career-levels";
import { GAME_CONFIG } from "@/constants/game-config";
import type { CareerLevel } from "@/types/game";

// ============================================================
// EXP & LEVEL
// ============================================================

export function calculateRequiredExp(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function calculateExpGain(
  basExp: number,
  streakDays: number,
  petBonus: number = 0
): number {
  const streakMultiplier = 1 + streakDays * GAME_CONFIG.streak.bonusMultiplier;
  const petMultiplier = 1 + petBonus / 100;
  return Math.floor(basExp * streakMultiplier * petMultiplier);
}

export function checkLevelUp(
  currentExp: number,
  currentLevel: number
): { leveledUp: boolean; newLevel: number; overflow: number } {
  let level = currentLevel;
  let exp = currentExp;
  let leveledUp = false;

  while (exp >= calculateRequiredExp(level)) {
    exp -= calculateRequiredExp(level);
    level++;
    leveledUp = true;
  }

  return { leveledUp, newLevel: level, overflow: exp };
}

// ============================================================
// CAREER PROMOTION / DEMOTION
// ============================================================

export interface PromotionCheckResult {
  eligible: boolean;
  reasons: string[];
  missing: string[];
}

export function checkPromotionEligibility(
  tasksCompleted: number,
  performanceScore: number,
  currentCareerSlug: string
): PromotionCheckResult {
  const currentLevel = CAREER_LEVELS.find((l) => l.slug === currentCareerSlug);
  if (!currentLevel) {
    return { eligible: false, reasons: [], missing: ["Career level not found"] };
  }

  const nextIndex = currentLevel.orderIndex + 1;
  const nextLevel = CAREER_LEVELS.find((l) => l.orderIndex === nextIndex);
  if (!nextLevel) {
    return { eligible: false, reasons: ["Đã đạt cấp cao nhất (CTO)!"], missing: [] };
  }

  const reasons: string[] = [];
  const missing: string[] = [];

  if (tasksCompleted >= nextLevel.requiredTasks) {
    reasons.push(`✅ Đã hoàn thành ${tasksCompleted}/${nextLevel.requiredTasks} nhiệm vụ`);
  } else {
    missing.push(`Cần ${nextLevel.requiredTasks - tasksCompleted} nhiệm vụ nữa`);
  }

  if (performanceScore >= nextLevel.minPerformanceScore) {
    reasons.push(`✅ Hiệu suất ${performanceScore}% ≥ ${nextLevel.minPerformanceScore}%`);
  } else {
    missing.push(`Hiệu suất cần ≥ ${nextLevel.minPerformanceScore}% (hiện ${performanceScore}%)`);
  }

  return {
    eligible: missing.length === 0,
    reasons,
    missing,
  };
}

export function getNextCareerLevel(currentSlug: string): CareerLevel | null {
  const current = CAREER_LEVELS.find((l) => l.slug === currentSlug);
  if (!current) return null;
  return CAREER_LEVELS.find((l) => l.orderIndex === current.orderIndex + 1) || null;
}

export function getPrevCareerLevel(currentSlug: string): CareerLevel | null {
  const current = CAREER_LEVELS.find((l) => l.slug === currentSlug);
  if (!current || current.orderIndex === 0) return null;
  return CAREER_LEVELS.find((l) => l.orderIndex === current.orderIndex - 1) || null;
}

// ============================================================
// DEMOTION RISK
// ============================================================

export function calculateDemotionRisk(
  performanceScore: number,
  currentStreak: number,
  tasksOnTimeRatio: number
): number {
  let risk = 0;

  // Low performance increases risk heavily
  if (performanceScore < GAME_CONFIG.demotion.performanceMinimum) {
    risk += 40;
  } else if (performanceScore < 50) {
    risk += 25;
  } else if (performanceScore < 70) {
    risk += 10;
  }

  // Broken streak increases risk
  if (currentStreak === 0) {
    risk += 20;
  }

  // Bad on-time ratio
  if (tasksOnTimeRatio < 0.5) {
    risk += 25;
  } else if (tasksOnTimeRatio < 0.7) {
    risk += 15;
  } else if (tasksOnTimeRatio < 0.9) {
    risk += 5;
  }

  return Math.min(risk, 100);
}

export function shouldDemote(demotionRisk: number): boolean {
  return demotionRisk >= GAME_CONFIG.demotion.riskThreshold;
}

// ============================================================
// STREAK
// ============================================================

export function updateStreak(
  lastActiveDate: string,
  currentStreak: number,
  longestStreak: number
): { newStreak: number; newLongest: number; streakBroken: boolean; milestone: number | null } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = new Date(lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return {
      newStreak: currentStreak,
      newLongest: longestStreak,
      streakBroken: false,
      milestone: null,
    };
  }

  if (diffDays === 1) {
    const newStreak = currentStreak + 1;
    const newLongest = Math.max(longestStreak, newStreak);
    const milestone =
      GAME_CONFIG.streak.milestones.find((m) => m === newStreak) || null;

    return { newStreak, newLongest, streakBroken: false, milestone };
  }

  // Streak broken
  return {
    newStreak: 1,
    newLongest: longestStreak,
    streakBroken: true,
    milestone: null,
  };
}

// ============================================================
// RANK TIER
// ============================================================

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "legend";

export function calculateRankTier(reputation: number): RankTier {
  const tiers = [...GAME_CONFIG.rankTiers].reverse();
  for (const tier of tiers) {
    if (reputation >= tier.minScore) {
      return tier.tier as RankTier;
    }
  }
  return "bronze";
}

export function getRankProgress(reputation: number): {
  currentTier: RankTier;
  nextTier: RankTier | null;
  progress: number;
  pointsToNext: number;
} {
  const currentTier = calculateRankTier(reputation);
  const currentConfig = GAME_CONFIG.rankTiers.find((t) => t.tier === currentTier)!;
  const currentIndex = GAME_CONFIG.rankTiers.indexOf(currentConfig);
  const nextConfig = GAME_CONFIG.rankTiers[currentIndex + 1] || null;

  if (!nextConfig) {
    return { currentTier, nextTier: null, progress: 100, pointsToNext: 0 };
  }

  const range = nextConfig.minScore - currentConfig.minScore;
  const current = reputation - currentConfig.minScore;

  return {
    currentTier,
    nextTier: nextConfig.tier as RankTier,
    progress: Math.min(Math.floor((current / range) * 100), 100),
    pointsToNext: nextConfig.minScore - reputation,
  };
}

// ============================================================
// PERFORMANCE SCORE
// ============================================================

export function calculatePerformanceScore(
  tasksCompleted: number,
  tasksOnTime: number,
  totalTasksAttempted: number
): number {
  if (totalTasksAttempted === 0) return 50;

  const completionRate = tasksCompleted / totalTasksAttempted;
  const onTimeRate = tasksCompleted > 0 ? tasksOnTime / tasksCompleted : 0;

  const score = Math.floor(completionRate * 60 + onTimeRate * 40);
  return Math.min(Math.max(score, 0), 100);
}

// ============================================================
// SALARY
// ============================================================

export function calculateSalary(
  baseSalary: number,
  performanceScore: number,
  rankTier: RankTier
): number {
  const perfMultiplier = 0.8 + (performanceScore / 100) * 0.4;
  const rankBonuses: Record<RankTier, number> = {
    bronze: 1.0,
    silver: 1.05,
    gold: 1.1,
    platinum: 1.15,
    diamond: 1.2,
    master: 1.3,
    legend: 1.5,
  };

  return Math.floor(baseSalary * perfMultiplier * rankBonuses[rankTier]);
}

// ============================================================
// REWARD CALCULATION (after successful submission)
// ============================================================

export interface TaskReward {
  expGained: number;
  salaryGained: number;
  reputationGained: number;
  leveledUp: boolean;
  newLevel: number;
  rankChanged: boolean;
  newRank: RankTier;
  streakMilestone: number | null;
}

export function calculateTaskReward(params: {
  baseExpReward: number;
  baseSalaryReward: number;
  baseReputationReward: number;
  currentExp: number;
  currentLevel: number;
  currentReputation: number;
  streakDays: number;
  petExpBonus: number;
}): TaskReward {
  const {
    baseExpReward,
    baseSalaryReward,
    baseReputationReward,
    currentExp,
    currentLevel,
    currentReputation,
    streakDays,
    petExpBonus,
  } = params;

  const expGained = calculateExpGain(baseExpReward, streakDays, petExpBonus);
  const salaryGained = baseSalaryReward;
  const reputationGained = baseReputationReward;

  const newTotalExp = currentExp + expGained;
  const { leveledUp, newLevel } = checkLevelUp(newTotalExp, currentLevel);

  const newReputation = currentReputation + reputationGained;
  const oldRank = calculateRankTier(currentReputation);
  const newRank = calculateRankTier(newReputation);
  const rankChanged = oldRank !== newRank;

  return {
    expGained,
    salaryGained,
    reputationGained,
    leveledUp,
    newLevel,
    rankChanged,
    newRank,
    streakMilestone: null,
  };
}
