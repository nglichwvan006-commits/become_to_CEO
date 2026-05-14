-- Seed Career Levels
INSERT INTO public.career_levels (id, name, slug, order_index, description, min_performance_score, required_tasks, salary, badge_icon, badge_color, skills) VALUES
  (gen_random_uuid(), 'Intern', 'intern', 0, 'Thực tập sinh mới vào nghề.', 0, 0, 3000000, '🌱', '#22c55e', '["Variables","Conditions","Loops","Functions"]'),
  (gen_random_uuid(), 'Junior Developer', 'junior', 1, 'Lập trình viên mới.', 40, 10, 8000000, '💻', '#3b82f6', '["Arrays","Strings","Sorting","Searching"]'),
  (gen_random_uuid(), 'Middle Developer', 'middle', 2, 'Lập trình viên có kinh nghiệm.', 55, 25, 18000000, '⚡', '#f59e0b', '["Stack","Queue","Recursion","Trees"]'),
  (gen_random_uuid(), 'Senior Developer', 'senior', 3, 'Chuyên gia kỹ thuật.', 70, 50, 35000000, '🔥', '#ef4444', '["Dynamic Programming","Advanced Algorithms"]'),
  (gen_random_uuid(), 'Tech Lead', 'tech-lead', 4, 'Trưởng nhóm kỹ thuật.', 80, 75, 50000000, '👑', '#a855f7', '["Clean Code","Testing","Code Review"]'),
  (gen_random_uuid(), 'Software Architect', 'architect', 5, 'Kiến trúc sư phần mềm.', 90, 90, 70000000, '🏗️', '#06b6d4', '["System Design","Databases","Scalability"]'),
  (gen_random_uuid(), 'CTO', 'cto', 6, 'Giám đốc Công nghệ.', 95, 100, 120000000, '🚀', '#fbbf24', '["Product Strategy","Technical Leadership"]');

-- Seed Achievements
INSERT INTO public.achievements (name, description, icon, category, condition_type, condition_value, exp_reward, reputation_reward) VALUES
  ('First Commit', 'Hoàn thành nhiệm vụ đầu tiên', '🎯', 'milestone', 'tasks_completed', 1, 10, 5),
  ('Bug Hunter', 'Sửa 5 bug', '🐛', 'skill', 'bug_fixes', 5, 25, 10),
  ('3-Day Streak', 'Duy trì streak 3 ngày', '🔥', 'streak', 'streak_days', 3, 15, 5),
  ('7-Day Streak', 'Duy trì streak 7 ngày', '💪', 'streak', 'streak_days', 7, 30, 10),
  ('Speed Runner', 'Hoàn thành 10 nhiệm vụ đúng hạn', '⚡', 'performance', 'on_time_tasks', 10, 50, 20),
  ('Code Master', 'Hoàn thành 50 nhiệm vụ', '👑', 'milestone', 'tasks_completed', 50, 100, 50),
  ('Perfect Score', 'Đạt 100% hiệu suất trong 7 ngày', '💎', 'performance', 'perfect_days', 7, 75, 30),
  ('Rising Star', 'Thăng cấp lên Junior', '⭐', 'promotion', 'career_level', 1, 50, 25);

-- Seed Pets
INSERT INTO public.pets (name, description, icon, rarity, bonus_type, bonus_value) VALUES
  ('Mèo Code', 'Mèo thông minh giúp debug nhanh hơn', '🐱', 'common', 'exp_boost', 5),
  ('Cú Đêm', 'Làm việc ban đêm hiệu quả hơn', '🦉', 'common', 'exp_boost', 5),
  ('Rồng Lửa', 'Tăng sức mạnh tổng hợp', '🐉', 'epic', 'exp_boost', 15),
  ('Phượng Hoàng', 'Giảm nguy cơ giáng chức', '🔥', 'legendary', 'demotion_shield', 20),
  ('Robot AI', 'Gợi ý thuật toán thông minh', '🤖', 'rare', 'hint_boost', 10),
  ('Kỳ Lân', 'Tăng danh tiếng', '🦄', 'epic', 'reputation_boost', 15);

-- Seed Season
INSERT INTO public.seasons (name, description, start_date, end_date, is_active, rewards) VALUES
  ('Season 1: Khởi Đầu', 'Mùa giải đầu tiên của Career Quest RPG', now(), now() + interval '30 days', true, '[{"rank":1,"reward":"500 EXP + Pet Legendary"},{"rank":2,"reward":"300 EXP"},{"rank":3,"reward":"200 EXP"}]');
