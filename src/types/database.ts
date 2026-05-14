export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      career_levels: {
        Row: {
          id: string;
          name: string;
          slug: string;
          order_index: number;
          description: string;
          min_performance_score: number;
          required_tasks: number;
          salary: number;
          badge_icon: string;
          badge_color: string;
          skills: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          order_index: number;
          description: string;
          min_performance_score?: number;
          required_tasks?: number;
          salary?: number;
          badge_icon?: string;
          badge_color?: string;
          skills?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          order_index?: number;
          description?: string;
          min_performance_score?: number;
          required_tasks?: number;
          salary?: number;
          badge_icon?: string;
          badge_color?: string;
          skills?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_careers: {
        Row: {
          id: string;
          profile_id: string;
          career_level_id: string;
          level: number;
          exp: number;
          reputation: number;
          salary: number;
          performance_score: number;
          tasks_completed: number;
          tasks_on_time: number;
          demotion_risk: number;
          rank_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "legend";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          career_level_id: string;
          level?: number;
          exp?: number;
          reputation?: number;
          salary?: number;
          performance_score?: number;
          tasks_completed?: number;
          tasks_on_time?: number;
          demotion_risk?: number;
          rank_tier?: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "legend";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          career_level_id?: string;
          level?: number;
          exp?: number;
          reputation?: number;
          salary?: number;
          performance_score?: number;
          tasks_completed?: number;
          tasks_on_time?: number;
          demotion_risk?: number;
          rank_tier?: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "legend";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_careers_career_level_id_fkey";
            columns: ["career_level_id"];
            isOneToOne: false;
            referencedRelation: "career_levels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_careers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          career_level_id: string;
          title: string;
          slug: string;
          type: "coding" | "bug_fix" | "refactor" | "code_review" | "system_design" | "database" | "deployment" | "debug";
          difficulty: "easy" | "medium" | "hard";
          category: string;
          statement: string;
          input_format: string;
          output_format: string;
          constraints: string;
          sample_input: string;
          sample_output: string;
          hidden_tests: Json;
          starter_code: Json;
          exp_reward: number;
          salary_reward: number;
          reputation_reward: number;
          deadline_hours: number;
          priority: "low" | "medium" | "high" | "critical";
          penalty_performance: number;
          penalty_reputation: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          career_level_id: string;
          title: string;
          slug: string;
          type?: "coding" | "bug_fix" | "refactor" | "code_review" | "system_design" | "database" | "deployment" | "debug";
          difficulty: "easy" | "medium" | "hard";
          category: string;
          statement: string;
          input_format: string;
          output_format: string;
          constraints: string;
          sample_input: string;
          sample_output: string;
          hidden_tests?: Json;
          starter_code?: Json;
          exp_reward?: number;
          salary_reward?: number;
          reputation_reward?: number;
          deadline_hours?: number;
          priority?: "low" | "medium" | "high" | "critical";
          penalty_performance?: number;
          penalty_reputation?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          career_level_id?: string;
          title?: string;
          slug?: string;
          type?: "coding" | "bug_fix" | "refactor" | "code_review" | "system_design" | "database" | "deployment" | "debug";
          difficulty?: "easy" | "medium" | "hard";
          category?: string;
          statement?: string;
          input_format?: string;
          output_format?: string;
          constraints?: string;
          sample_input?: string;
          sample_output?: string;
          hidden_tests?: Json;
          starter_code?: Json;
          exp_reward?: number;
          salary_reward?: number;
          reputation_reward?: number;
          deadline_hours?: number;
          priority?: "low" | "medium" | "high" | "critical";
          penalty_performance?: number;
          penalty_reputation?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_career_level_id_fkey";
            columns: ["career_level_id"];
            isOneToOne: false;
            referencedRelation: "career_levels";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: {
          id: string;
          profile_id: string;
          task_id: string;
          code: string;
          language: string;
          status: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
          runtime_ms: number | null;
          memory_kb: number | null;
          output: string | null;
          error: string | null;
          test_results: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          task_id: string;
          code: string;
          language: string;
          status?: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
          runtime_ms?: number | null;
          memory_kb?: number | null;
          output?: string | null;
          error?: string | null;
          test_results?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          task_id?: string;
          code?: string;
          language?: string;
          status?: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
          runtime_ms?: number | null;
          memory_kb?: number | null;
          output?: string | null;
          error?: string | null;
          test_results?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          condition_type: string;
          condition_value: number;
          exp_reward: number;
          reputation_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          condition_type: string;
          condition_value: number;
          exp_reward?: number;
          reputation_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          category?: string;
          condition_type?: string;
          condition_value?: number;
          exp_reward?: number;
          reputation_reward?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          profile_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          bonus_type: string;
          bonus_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          bonus_type: string;
          bonus_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          bonus_type?: string;
          bonus_value?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_pets: {
        Row: {
          id: string;
          profile_id: string;
          pet_id: string;
          is_active: boolean;
          acquired_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          pet_id: string;
          is_active?: boolean;
          acquired_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          pet_id?: string;
          is_active?: boolean;
          acquired_at?: string;
        };
        Relationships: [];
      };
      seasons: {
        Row: {
          id: string;
          name: string;
          description: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          rewards: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          rewards?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          rewards?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      season_rankings: {
        Row: {
          id: string;
          season_id: string;
          profile_id: string;
          rank_position: number;
          score: number;
          career_level_reached: string;
          tasks_completed: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          season_id: string;
          profile_id: string;
          rank_position?: number;
          score?: number;
          career_level_reached?: string;
          tasks_completed?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          season_id?: string;
          profile_id?: string;
          rank_position?: number;
          score?: number;
          career_level_reached?: string;
          tasks_completed?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      streaks: {
        Row: {
          id: string;
          profile_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      performance_logs: {
        Row: {
          id: string;
          profile_id: string;
          date: string;
          score: number;
          tasks_completed: number;
          tasks_on_time: number;
          exp_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          date: string;
          score?: number;
          tasks_completed?: number;
          tasks_on_time?: number;
          exp_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          date?: string;
          score?: number;
          tasks_completed?: number;
          tasks_on_time?: number;
          exp_earned?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      promotion_challenges: {
        Row: {
          id: string;
          from_level_id: string;
          to_level_id: string;
          title: string;
          description: string;
          challenge_type: string;
          challenge_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_level_id: string;
          to_level_id: string;
          title: string;
          description: string;
          challenge_type: string;
          challenge_data?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_level_id?: string;
          to_level_id?: string;
          title?: string;
          description?: string;
          challenge_type?: string;
          challenge_data?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_challenge_attempts: {
        Row: {
          id: string;
          profile_id: string;
          challenge_id: string;
          passed: boolean;
          score: number;
          attempted_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          challenge_id: string;
          passed?: boolean;
          score?: number;
          attempted_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          challenge_id?: string;
          passed?: boolean;
          score?: number;
          attempted_at?: string;
        };
        Relationships: [];
      };
      daily_quests: {
        Row: {
          id: string;
          profile_id: string;
          date: string;
          quests: Json;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          date: string;
          quests: Json;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          date?: string;
          quests?: Json;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      difficulty: "easy" | "medium" | "hard";
      task_type: "coding" | "bug_fix" | "refactor" | "code_review" | "system_design" | "database" | "deployment" | "debug";
      priority: "low" | "medium" | "high" | "critical";
      rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
      rank_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "legend";
      submission_status: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
      user_role: "user" | "admin";
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
