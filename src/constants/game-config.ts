export const GAME_CONFIG = {
  exp: {
    easy: 10,
    medium: 25,
    hard: 50,
  },
  levelFormula: (level: number) => Math.floor(100 * Math.pow(level, 1.5)),
  demotion: {
    riskThreshold: 70,
    streakBreakDays: 3,
    performanceMinimum: 30,
  },
  promotion: {
    challengeRequired: true,
    minPerformanceDays: 7,
  },
  streak: {
    milestones: [3, 7, 14, 30, 60, 100, 365],
    bonusMultiplier: 0.1,
  },
  rankTiers: [
    { tier: "bronze", minScore: 0, label: "Đồng", color: "#cd7f32", icon: "🥉" },
    { tier: "silver", minScore: 100, label: "Bạc", color: "#c0c0c0", icon: "🥈" },
    { tier: "gold", minScore: 300, label: "Vàng", color: "#ffd700", icon: "🥇" },
    { tier: "platinum", minScore: 600, label: "Bạch Kim", color: "#e5e4e2", icon: "💎" },
    { tier: "diamond", minScore: 1000, label: "Kim Cương", color: "#b9f2ff", icon: "💠" },
    { tier: "master", minScore: 2000, label: "Cao Thủ", color: "#ff6b6b", icon: "🔥" },
    { tier: "legend", minScore: 5000, label: "Huyền Thoại", color: "#ffd700", icon: "👑" },
  ] as const,
  season: {
    durationDays: 30,
  },
  taskTypes: [
    { type: "coding", label: "Coding", icon: "💻", color: "#7c3aed" },
    { type: "bug_fix", label: "Bug Fix", icon: "🐛", color: "#ef4444" },
    { type: "refactor", label: "Refactor", icon: "♻️", color: "#06b6d4" },
    { type: "code_review", label: "Code Review", icon: "👀", color: "#f59e0b" },
    { type: "system_design", label: "System Design", icon: "🏗️", color: "#ec4899" },
    { type: "database", label: "Database", icon: "🗄️", color: "#22c55e" },
    { type: "deployment", label: "Deployment", icon: "🚀", color: "#8b5cf6" },
    { type: "debug", label: "Debug", icon: "🔍", color: "#f97316" },
  ] as const,
} as const;
