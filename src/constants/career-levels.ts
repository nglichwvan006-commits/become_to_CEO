import type { CareerLevel } from "@/types/game";

export const CAREER_LEVELS: CareerLevel[] = [
  {
    id: "intern",
    name: "Intern",
    slug: "intern",
    orderIndex: 0,
    description: "Thực tập sinh mới vào nghề. Học những kiến thức cơ bản nhất về lập trình.",
    minPerformanceScore: 0,
    requiredTasks: 0,
    salary: 3_000_000,
    badgeIcon: "🌱",
    badgeColor: "#22c55e",
    skills: ["Variables", "Conditions", "Loops", "Functions"],
  },
  {
    id: "junior",
    name: "Junior Developer",
    slug: "junior",
    orderIndex: 1,
    description: "Lập trình viên mới. Có thể tự giải quyết các bài toán đơn giản.",
    minPerformanceScore: 40,
    requiredTasks: 10,
    salary: 8_000_000,
    badgeIcon: "💻",
    badgeColor: "#3b82f6",
    skills: ["Arrays", "Strings", "Sorting", "Searching"],
  },
  {
    id: "middle",
    name: "Middle Developer",
    slug: "middle",
    orderIndex: 2,
    description: "Lập trình viên có kinh nghiệm. Nắm vững các cấu trúc dữ liệu và thuật toán.",
    minPerformanceScore: 55,
    requiredTasks: 25,
    salary: 18_000_000,
    badgeIcon: "⚡",
    badgeColor: "#f59e0b",
    skills: ["Stack", "Queue", "Recursion", "Trees", "Graphs"],
  },
  {
    id: "senior",
    name: "Senior Developer",
    slug: "senior",
    orderIndex: 3,
    description: "Chuyên gia kỹ thuật. Giải quyết được các bài toán phức tạp và tối ưu hóa.",
    minPerformanceScore: 70,
    requiredTasks: 50,
    salary: 35_000_000,
    badgeIcon: "🔥",
    badgeColor: "#ef4444",
    skills: ["Dynamic Programming", "Advanced Algorithms", "Optimization"],
  },
  {
    id: "tech-lead",
    name: "Tech Lead",
    slug: "tech-lead",
    orderIndex: 4,
    description: "Trưởng nhóm kỹ thuật. Dẫn dắt team và đảm bảo chất lượng code.",
    minPerformanceScore: 80,
    requiredTasks: 75,
    salary: 50_000_000,
    badgeIcon: "👑",
    badgeColor: "#a855f7",
    skills: ["Clean Code", "Testing", "Code Review", "Mentoring"],
  },
  {
    id: "architect",
    name: "Software Architect",
    slug: "architect",
    orderIndex: 5,
    description: "Kiến trúc sư phần mềm. Thiết kế hệ thống quy mô lớn.",
    minPerformanceScore: 90,
    requiredTasks: 90,
    salary: 70_000_000,
    badgeIcon: "🏗️",
    badgeColor: "#06b6d4",
    skills: ["System Design", "Databases", "Scalability", "Microservices"],
  },
  {
    id: "cto",
    name: "CTO",
    slug: "cto",
    orderIndex: 6,
    description: "Giám đốc Công nghệ. Định hướng chiến lược kỹ thuật cho toàn công ty.",
    minPerformanceScore: 95,
    requiredTasks: 100,
    salary: 120_000_000,
    badgeIcon: "🚀",
    badgeColor: "#fbbf24",
    skills: ["Product Strategy", "Technical Leadership", "Innovation"],
  },
];

export function getCareerLevel(slug: string): CareerLevel | undefined {
  return CAREER_LEVELS.find((l) => l.slug === slug);
}

export function getNextCareerLevel(currentSlug: string): CareerLevel | undefined {
  const current = CAREER_LEVELS.find((l) => l.slug === currentSlug);
  if (!current) return undefined;
  return CAREER_LEVELS.find((l) => l.orderIndex === current.orderIndex + 1);
}

export function getPrevCareerLevel(currentSlug: string): CareerLevel | undefined {
  const current = CAREER_LEVELS.find((l) => l.slug === currentSlug);
  if (!current || current.orderIndex === 0) return undefined;
  return CAREER_LEVELS.find((l) => l.orderIndex === current.orderIndex - 1);
}
