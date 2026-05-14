-- ============================================================
-- Career Quest RPG — Database Schema
-- ============================================================

-- Enums
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.task_type AS ENUM ('coding', 'bug_fix', 'refactor', 'code_review', 'system_design', 'database', 'deployment', 'debug');
CREATE TYPE public.priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE public.rank_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'legend');
CREATE TYPE public.submission_status AS ENUM ('pending', 'running', 'accepted', 'wrong_answer', 'time_limit', 'runtime_error', 'compilation_error');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- ============================================================
-- CAREER LEVELS
-- ============================================================
CREATE TABLE public.career_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  order_index INT NOT NULL,
  description TEXT NOT NULL,
  min_performance_score INT NOT NULL DEFAULT 0,
  required_tasks INT NOT NULL DEFAULT 0,
  salary INT NOT NULL DEFAULT 0,
  badge_icon TEXT NOT NULL DEFAULT '🌱',
  badge_color TEXT NOT NULL DEFAULT '#22c55e',
  skills JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_career_levels_slug ON public.career_levels(slug);
CREATE INDEX idx_career_levels_order ON public.career_levels(order_index);

-- ============================================================
-- USER CAREERS
-- ============================================================
CREATE TABLE public.user_careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_level_id UUID NOT NULL REFERENCES public.career_levels(id),
  level INT NOT NULL DEFAULT 1,
  exp INT NOT NULL DEFAULT 0,
  reputation INT NOT NULL DEFAULT 0,
  salary INT NOT NULL DEFAULT 3000000,
  performance_score INT NOT NULL DEFAULT 50,
  tasks_completed INT NOT NULL DEFAULT 0,
  tasks_on_time INT NOT NULL DEFAULT 0,
  demotion_risk INT NOT NULL DEFAULT 0,
  rank_tier public.rank_tier NOT NULL DEFAULT 'bronze',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);
CREATE INDEX idx_user_careers_profile ON public.user_careers(profile_id);

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_level_id UUID NOT NULL REFERENCES public.career_levels(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.task_type NOT NULL DEFAULT 'coding',
  difficulty public.difficulty NOT NULL,
  category TEXT NOT NULL,
  statement TEXT NOT NULL,
  input_format TEXT NOT NULL DEFAULT '',
  output_format TEXT NOT NULL DEFAULT '',
  constraints TEXT NOT NULL DEFAULT '',
  sample_input TEXT NOT NULL DEFAULT '',
  sample_output TEXT NOT NULL DEFAULT '',
  hidden_tests JSONB NOT NULL DEFAULT '[]',
  starter_code JSONB NOT NULL DEFAULT '{}',
  exp_reward INT NOT NULL DEFAULT 10,
  salary_reward INT NOT NULL DEFAULT 0,
  reputation_reward INT NOT NULL DEFAULT 0,
  deadline_hours INT NOT NULL DEFAULT 24,
  priority public.priority NOT NULL DEFAULT 'low',
  penalty_performance INT NOT NULL DEFAULT 5,
  penalty_reputation INT NOT NULL DEFAULT 3,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tasks_slug ON public.tasks(slug);
CREATE INDEX idx_tasks_career ON public.tasks(career_level_id);
CREATE INDEX idx_tasks_difficulty ON public.tasks(difficulty);
CREATE INDEX idx_tasks_type ON public.tasks(type);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'pending',
  runtime_ms INT,
  memory_kb INT,
  output TEXT,
  error TEXT,
  test_results JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_submissions_profile ON public.submissions(profile_id);
CREATE INDEX idx_submissions_task ON public.submissions(task_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INT NOT NULL,
  exp_reward INT NOT NULL DEFAULT 0,
  reputation_reward INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, achievement_id)
);

-- ============================================================
-- PETS
-- ============================================================
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity public.rarity NOT NULL,
  bonus_type TEXT NOT NULL,
  bonus_value INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, pet_id)
);

-- ============================================================
-- SEASONS
-- ============================================================
CREATE TABLE public.seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  rewards JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.season_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rank_position INT NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  career_level_reached TEXT NOT NULL DEFAULT '',
  tasks_completed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(season_id, profile_id)
);

-- ============================================================
-- STREAKS
-- ============================================================
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- ============================================================
-- PERFORMANCE LOGS
-- ============================================================
CREATE TABLE public.performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  score INT NOT NULL DEFAULT 0,
  tasks_completed INT NOT NULL DEFAULT 0,
  tasks_on_time INT NOT NULL DEFAULT 0,
  exp_earned INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, date)
);

-- ============================================================
-- PROMOTION CHALLENGES
-- ============================================================
CREATE TABLE public.promotion_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_level_id UUID NOT NULL REFERENCES public.career_levels(id),
  to_level_id UUID NOT NULL REFERENCES public.career_levels(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  challenge_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.promotion_challenges(id) ON DELETE CASCADE,
  passed BOOLEAN NOT NULL DEFAULT false,
  score INT NOT NULL DEFAULT 0,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DAILY QUESTS
-- ============================================================
CREATE TABLE public.daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  quests JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, date)
);

-- ============================================================
-- AUTO-CREATE PROFILE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  intern_level_id UUID;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Get intern career level
  SELECT id INTO intern_level_id FROM public.career_levels WHERE slug = 'intern' LIMIT 1;

  -- Create user career at Intern level
  IF intern_level_id IS NOT NULL THEN
    INSERT INTO public.user_careers (profile_id, career_level_id)
    VALUES (NEW.id, intern_level_id);
  END IF;

  -- Create streak record
  INSERT INTO public.streaks (profile_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Careers
ALTER TABLE public.user_careers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all careers" ON public.user_careers FOR SELECT USING (true);
CREATE POLICY "Users can update own career" ON public.user_careers FOR UPDATE USING (auth.uid() = profile_id);

-- Career Levels (public read)
ALTER TABLE public.career_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view career levels" ON public.career_levels FOR SELECT USING (true);

-- Tasks (public read)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tasks" ON public.tasks FOR SELECT USING (true);

-- Submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can create submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Achievements (public read)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- User Achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = profile_id);

-- Pets (public read)
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view pets" ON public.pets FOR SELECT USING (true);

-- User Pets
ALTER TABLE public.user_pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pets" ON public.user_pets FOR SELECT USING (auth.uid() = profile_id);

-- Seasons (public read)
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view seasons" ON public.seasons FOR SELECT USING (true);

-- Season Rankings (public read)
ALTER TABLE public.season_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rankings" ON public.season_rankings FOR SELECT USING (true);

-- Streaks
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streaks" ON public.streaks FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update own streaks" ON public.streaks FOR UPDATE USING (auth.uid() = profile_id);

-- Performance Logs
ALTER TABLE public.performance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON public.performance_logs FOR SELECT USING (auth.uid() = profile_id);

-- Daily Quests
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quests" ON public.daily_quests FOR SELECT USING (auth.uid() = profile_id);

-- Promotion Challenges (public read)
ALTER TABLE public.promotion_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view challenges" ON public.promotion_challenges FOR SELECT USING (true);

-- User Challenge Attempts
ALTER TABLE public.user_challenge_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.user_challenge_attempts FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can create attempts" ON public.user_challenge_attempts FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER user_careers_updated_at BEFORE UPDATE ON public.user_careers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER streaks_updated_at BEFORE UPDATE ON public.streaks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
