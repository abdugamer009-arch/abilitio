-- Reject invalid new writes without silently rewriting historical user records.
ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_sat_range
  CHECK (sat_score IS NULL OR sat_score BETWEEN 400 AND 1600) NOT VALID;
ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_ielts_range
  CHECK (ielts_band IS NULL OR
    (ielts_band BETWEEN 0 AND 9 AND mod(ielts_band::numeric, 0.5) = 0)) NOT VALID;
