import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CAREER_LEVELS } from "@/constants/career-levels";
import {
  calculateDemotionRisk,
  calculateRankTier,
  calculateSalary,
  calculatePerformanceScore,
  calculateTaskReward,
  checkLevelUp,
  checkPromotionEligibility,
  updateStreak,
  type RankTier,
  type TaskReward,
} from "@/lib/gamification";

interface DailyQuest {
  id: string;
  title: string;
  current: number;
  target: number;
  completed: boolean;
}

interface Achievement {
  name: string;
  icon: string;
  unlockedAt: string;
}

export interface CareerState {
  // Career info
  careerLevelSlug: string;
  level: number;
  exp: number;
  reputation: number;
  salary: number;
  performanceScore: number;
  tasksCompleted: number;
  tasksOnTime: number;
  demotionRisk: number;
  rankTier: RankTier;

  // Streak
  streak: number;
  longestStreak: number;
  lastActiveDate: string;

  // Daily quests
  dailyQuests: DailyQuest[];

  // Achievements (recent)
  recentAchievements: Achievement[];

  // Pet bonus
  activePetBonus: number;

  // Last reward (for showing toast)
  lastReward: TaskReward | null;

  // Actions
  processTaskCompletion: (params: {
    expReward: number;
    salaryReward: number;
    reputationReward: number;
    onTime: boolean;
  }) => TaskReward;
  updateDailyStreak: () => void;
  promoteCareer: () => boolean;
  resetLastReward: () => void;
  setPetBonus: (bonus: number) => void;
}

const initialDailyQuests: DailyQuest[] = [
  { id: "1", title: "Hoàn thành 3 nhiệm vụ", current: 0, target: 3, completed: false },
  { id: "2", title: "Đạt 50 EXP", current: 0, target: 50, completed: false },
  { id: "3", title: "Duy trì streak", current: 0, target: 1, completed: false },
];

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      careerLevelSlug: "intern",
      level: 1,
      exp: 0,
      reputation: 0,
      salary: 3_000_000,
      performanceScore: 50,
      tasksCompleted: 0,
      tasksOnTime: 0,
      demotionRisk: 0,
      rankTier: "bronze" as RankTier,

      streak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],

      dailyQuests: initialDailyQuests,
      recentAchievements: [],
      activePetBonus: 0,
      lastReward: null,

      resetLastReward: () => set({ lastReward: null }),
      setPetBonus: (bonus) => set({ activePetBonus: bonus }),

      updateDailyStreak: () => {
        const state = get();
        const result = updateStreak(
          state.lastActiveDate,
          state.streak,
          state.longestStreak
        );

        const quests = state.dailyQuests.map((q) => {
          if (q.id === "3") {
            return { ...q, current: 1, completed: true };
          }
          return q;
        });

        set({
          streak: result.newStreak,
          longestStreak: result.newLongest,
          lastActiveDate: new Date().toISOString().split("T")[0],
          dailyQuests: quests,
        });
      },

      processTaskCompletion: (params) => {
        const state = get();
        const { expReward, salaryReward, reputationReward, onTime } = params;

        // Calculate reward with bonuses
        const reward = calculateTaskReward({
          baseExpReward: expReward,
          baseSalaryReward: salaryReward,
          baseReputationReward: reputationReward,
          currentExp: state.exp,
          currentLevel: state.level,
          currentReputation: state.reputation,
          streakDays: state.streak,
          petExpBonus: state.activePetBonus,
        });

        const newExp = state.exp + reward.expGained;
        const newReputation = state.reputation + reward.reputationGained;
        const newTasksCompleted = state.tasksCompleted + 1;
        const newTasksOnTime = onTime ? state.tasksOnTime + 1 : state.tasksOnTime;

        // Check level up
        const levelResult = checkLevelUp(newExp, state.level);

        // Rank
        const newRank = calculateRankTier(newReputation);

        // Performance
        const newPerformance = calculatePerformanceScore(
          newTasksCompleted,
          newTasksOnTime,
          newTasksCompleted
        );

        // Demotion risk
        const onTimeRatio = newTasksCompleted > 0
          ? newTasksOnTime / newTasksCompleted
          : 1;
        const newDemotionRisk = calculateDemotionRisk(
          newPerformance,
          state.streak,
          onTimeRatio
        );

        // Career level salary
        const careerLevel = CAREER_LEVELS.find(
          (l) => l.slug === state.careerLevelSlug
        );
        const newSalary = calculateSalary(
          careerLevel?.salary || 3_000_000,
          newPerformance,
          newRank
        );

        // Daily quests progress
        const quests = state.dailyQuests.map((q) => {
          if (q.id === "1") {
            const newCurrent = Math.min(q.current + 1, q.target);
            return { ...q, current: newCurrent, completed: newCurrent >= q.target };
          }
          if (q.id === "2") {
            const newCurrent = Math.min(q.current + reward.expGained, q.target);
            return { ...q, current: newCurrent, completed: newCurrent >= q.target };
          }
          return q;
        });

        // Achievements check
        const newAchievements = [...state.recentAchievements];
        if (newTasksCompleted === 1) {
          newAchievements.unshift({
            name: "First Commit",
            icon: "🎯",
            unlockedAt: "Vừa xong",
          });
        }
        if (newTasksCompleted === 10) {
          newAchievements.unshift({
            name: "Task Apprentice",
            icon: "⚡",
            unlockedAt: "Vừa xong",
          });
        }
        if (newTasksCompleted === 50) {
          newAchievements.unshift({
            name: "Code Master",
            icon: "👑",
            unlockedAt: "Vừa xong",
          });
        }

        // Keep only last 5 achievements
        const trimmedAchievements = newAchievements.slice(0, 5);

        set({
          exp: levelResult.leveledUp ? levelResult.overflow : newExp,
          level: levelResult.newLevel,
          reputation: newReputation,
          salary: newSalary,
          performanceScore: newPerformance,
          tasksCompleted: newTasksCompleted,
          tasksOnTime: newTasksOnTime,
          demotionRisk: newDemotionRisk,
          rankTier: newRank,
          dailyQuests: quests,
          recentAchievements: trimmedAchievements,
          lastReward: reward,
        });

        return reward;
      },

      promoteCareer: () => {
        const state = get();
        const eligibility = checkPromotionEligibility(
          state.tasksCompleted,
          state.performanceScore,
          state.careerLevelSlug
        );

        if (!eligibility.eligible) return false;

        const currentLevel = CAREER_LEVELS.find(
          (l) => l.slug === state.careerLevelSlug
        );
        if (!currentLevel) return false;

        const nextLevel = CAREER_LEVELS.find(
          (l) => l.orderIndex === currentLevel.orderIndex + 1
        );
        if (!nextLevel) return false;

        set({
          careerLevelSlug: nextLevel.slug,
          salary: nextLevel.salary,
          demotionRisk: 0,
          recentAchievements: [
            {
              name: `Thăng cấp ${nextLevel.name}!`,
              icon: nextLevel.badgeIcon,
              unlockedAt: "Vừa xong",
            },
            ...state.recentAchievements.slice(0, 4),
          ],
        });

        return true;
      },
    }),
    {
      name: "career-quest-career",
      partialize: (state) => ({
        careerLevelSlug: state.careerLevelSlug,
        level: state.level,
        exp: state.exp,
        reputation: state.reputation,
        salary: state.salary,
        performanceScore: state.performanceScore,
        tasksCompleted: state.tasksCompleted,
        tasksOnTime: state.tasksOnTime,
        demotionRisk: state.demotionRisk,
        rankTier: state.rankTier,
        streak: state.streak,
        longestStreak: state.longestStreak,
        lastActiveDate: state.lastActiveDate,
        recentAchievements: state.recentAchievements,
        activePetBonus: state.activePetBonus,
      }),
    }
  )
);
