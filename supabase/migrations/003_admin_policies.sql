-- ============================================================
-- Career Quest RPG - Admin Policies
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tasks: admin can manage the task catalog.
CREATE POLICY "Admins can create tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update tasks"
  ON public.tasks
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete tasks"
  ON public.tasks
  FOR DELETE
  USING (public.is_admin());

-- Profiles: admin can assign roles and moderate visible profile data.
CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- User careers: admin can moderate performance/risk state.
CREATE POLICY "Admins can update user careers"
  ON public.user_careers
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Submissions: admin can inspect submissions for moderation/support.
CREATE POLICY "Admins can view all submissions"
  ON public.submissions
  FOR SELECT
  USING (public.is_admin());
