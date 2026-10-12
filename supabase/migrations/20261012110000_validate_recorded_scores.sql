-- Fail visibly if any historical score is invalid; never rewrite user scores.
ALTER TABLE public.user_stats VALIDATE CONSTRAINT user_stats_sat_range;
ALTER TABLE public.user_stats VALIDATE CONSTRAINT user_stats_ielts_range;
