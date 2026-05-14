import type { ManagedUser, UserStatus } from "@/types/admin";
import type { Tables } from "@/types/database";

export type AdminProfileRow = Tables<"profiles"> & {
  user_careers:
    | (Pick<
        Tables<"user_careers">,
        | "tasks_completed"
        | "performance_score"
        | "demotion_risk"
        | "reputation"
        | "salary"
        | "updated_at"
      > & {
        career_levels: Pick<Tables<"career_levels">, "name"> | null;
      })
    | null;
};

export function getUserStatus(row: AdminProfileRow): UserStatus {
  const risk = row.user_careers?.demotion_risk ?? 0;
  const performance = row.user_careers?.performance_score ?? 50;

  if (risk >= 85 || performance <= 35) return "locked";
  if (risk >= 70 || performance <= 50) return "at_risk";
  return "active";
}

export function toManagedUser(row: AdminProfileRow): ManagedUser {
  return {
    id: row.id,
    name: row.username ?? "Unnamed learner",
    email: row.username ? `${row.username}@careerquest.local` : "hidden@careerquest.local",
    role: row.role,
    status: getUserStatus(row),
    careerLevel: row.user_careers?.career_levels?.name ?? "Intern",
    tasksCompleted: row.user_careers?.tasks_completed ?? 0,
    performanceScore: row.user_careers?.performance_score ?? 50,
    demotionRisk: row.user_careers?.demotion_risk ?? 0,
    reputation: row.user_careers?.reputation ?? 0,
    salary: row.user_careers?.salary ?? 3000000,
    lastActive: (row.user_careers?.updated_at ?? row.updated_at).slice(0, 10),
  };
}
