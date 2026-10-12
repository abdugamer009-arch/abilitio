-- Cover the seven foreign keys identified by the production advisor.
-- No record or access policy is changed.
CREATE INDEX IF NOT EXISTS career_answers_user_idx ON public.career_assessment_answers(user_id);
CREATE INDEX IF NOT EXISTS school_members_user_idx ON public.school_members(user_id);
CREATE INDEX IF NOT EXISTS school_members_class_idx ON public.school_members(class_id);
CREATE INDEX IF NOT EXISTS specialized_classes_school_idx ON public.school_specialized_classes(school_id);
CREATE INDEX IF NOT EXISTS specialized_classes_creator_idx ON public.school_specialized_classes(created_by);
CREATE INDEX IF NOT EXISTS school_users_user_idx ON public.school_users(user_id);
CREATE INDEX IF NOT EXISTS schools_owner_idx ON public.schools(owner_user_id);
