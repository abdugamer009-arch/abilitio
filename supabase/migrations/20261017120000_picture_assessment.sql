-- Metadata only: never recalculate a historical score or stored ranking.
ALTER TABLE public.career_assessment_results ADD COLUMN IF NOT EXISTS question_set_version text NOT NULL DEFAULT 'legacy-question-set-unknown';
COMMENT ON COLUMN public.career_assessment_results.question_set_version IS 'Immutable administered set tag. Historical exact membership is unknown; scores and rankings are unchanged.';

CREATE TABLE public.picture_assessment_drafts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_nonce text NOT NULL CHECK (session_nonce ~ '^[a-f0-9]{32}$'),
  question_set_version text NOT NULL,
  expires_at timestamptz NOT NULL,
  revision integer NOT NULL CHECK (revision >= 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND octet_length(payload::text) <= 300000),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, session_nonce)
);
CREATE TABLE public.picture_assessment_items (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_nonce text NOT NULL CHECK (session_nonce ~ '^[a-f0-9]{32}$'),
  question_id text NOT NULL,
  question_set_version text NOT NULL,
  section text NOT NULL CHECK (section IN ('personality','cognitive','interest')),
  age_group text NOT NULL CHECK (age_group IN ('child','teen_adult')),
  slot integer,
  item_version text,
  shown boolean NOT NULL,
  answered boolean NOT NULL,
  chosen_answer text,
  time_ms bigint NOT NULL CHECK (time_ms BETWEEN 0 AND 86400000),
  is_correct boolean,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, session_nonce, question_id),
  CHECK (answered = (chosen_answer IS NOT NULL)),
  CHECK (NOT answered OR shown),
  CHECK (is_correct IS NULL OR (section = 'cognitive' AND answered))
);
ALTER TABLE public.picture_assessment_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.picture_assessment_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.picture_assessment_drafts, public.picture_assessment_items FROM anon, authenticated;
-- Drafts are available to their owner. Students cannot read private item timing or grading.
GRANT SELECT ON public.picture_assessment_drafts TO authenticated;
CREATE POLICY picture_draft_owner ON public.picture_assessment_drafts FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
GRANT SELECT ON public.picture_assessment_items TO authenticated;
CREATE POLICY picture_stats_admin ON public.picture_assessment_items FOR SELECT TO authenticated USING (public.has_role((SELECT auth.uid()), 'admin'));
GRANT ALL ON public.picture_assessment_drafts, public.picture_assessment_items TO service_role;

-- Server verification precedes this service-only atomic save. Stale retries cannot
-- overwrite a newer revision; failed item writes roll the draft back as well.
CREATE FUNCTION public.save_picture_progress(
  _user_id uuid, _nonce text, _set_version text, _expires_at timestamptz,
  _revision integer, _payload jsonb, _items jsonb
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE accepted integer;
BEGIN
  IF _expires_at <= now() OR _expires_at > now() + interval '24 hours' THEN RAISE EXCEPTION 'session_expired'; END IF;
  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) > 30 THEN RAISE EXCEPTION 'invalid_items'; END IF;
  IF EXISTS (SELECT 1 FROM public.career_assessment_results WHERE user_id = _user_id AND session_nonce = _nonce) THEN
    DELETE FROM public.picture_assessment_drafts WHERE user_id = _user_id AND session_nonce = _nonce;
    RETURN true;
  END IF;
  INSERT INTO public.picture_assessment_drafts(user_id,session_nonce,question_set_version,expires_at,revision,payload)
    VALUES (_user_id,_nonce,_set_version,_expires_at,_revision,_payload)
    ON CONFLICT (user_id,session_nonce) DO UPDATE SET revision=EXCLUDED.revision,payload=EXCLUDED.payload,updated_at=now()
    WHERE public.picture_assessment_drafts.revision <= EXCLUDED.revision
    RETURNING revision INTO accepted;
  IF accepted IS NULL THEN RETURN false; END IF;
  INSERT INTO public.picture_assessment_items(user_id,session_nonce,question_id,question_set_version,section,age_group,slot,item_version,shown,answered,chosen_answer,time_ms,is_correct)
    SELECT _user_id,_nonce,x.question_id,_set_version,x.section,x.age_group,x.slot,x.item_version,x.shown,x.answered,x.chosen_answer,x.time_ms,x.is_correct
    FROM jsonb_to_recordset(_items) AS x(question_id text,section text,age_group text,slot integer,item_version text,shown boolean,answered boolean,chosen_answer text,time_ms bigint,is_correct boolean)
    ON CONFLICT (user_id,session_nonce,question_id) DO UPDATE SET
      shown=EXCLUDED.shown,answered=EXCLUDED.answered,chosen_answer=EXCLUDED.chosen_answer,time_ms=EXCLUDED.time_ms,is_correct=EXCLUDED.is_correct,updated_at=now();
  RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.save_picture_progress(uuid,text,text,timestamptz,integer,jsonb,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_picture_progress(uuid,text,text,timestamptz,integer,jsonb,jsonb) TO service_role;
CREATE INDEX picture_items_set_question ON public.picture_assessment_items(question_set_version,question_id);
CREATE INDEX picture_drafts_expiry ON public.picture_assessment_drafts(expires_at);
