export interface CareerLevel {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  description: string;
  minPerformanceScore: number;
  requiredTasks: number;
  salary: number;
  badgeIcon: string;
  badgeColor: string;
  skills: string[];
}

export interface UserCareer {
  level: number;
  exp: number;
  reputation: number;
  salary: number;
  performanceScore: number;
  tasksCompleted: number;
  tasksOnTime: number;
  demotionRisk: number;
  rankTier: RankTier;
  careerLevel: CareerLevel;
}

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "legend";

export type TaskType = "coding" | "bug_fix" | "refactor" | "code_review" | "system_design" | "database" | "deployment" | "debug";

export type Difficulty = "easy" | "medium" | "hard";

export type Priority = "low" | "medium" | "high" | "critical";

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  reward: {
    exp: number;
    reputation: number;
  };
}
