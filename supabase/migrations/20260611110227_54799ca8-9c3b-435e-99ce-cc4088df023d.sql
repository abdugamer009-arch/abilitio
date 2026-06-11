
-- ============ TABLES ============

CREATE TABLE public.personality_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number int NOT NULL UNIQUE CHECK (question_number BETWEEN 1 AND 48),
  left_statement text NOT NULL,
  right_statement text NOT NULL,
  category text NOT NULL CHECK (category IN ('IE','SN','FT','JP')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.personality_questions TO authenticated;
GRANT ALL ON public.personality_questions TO service_role;
ALTER TABLE public.personality_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read questions" ON public.personality_questions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.personality_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.personality_questions(id) ON DELETE CASCADE,
  answer_value int NOT NULL CHECK (answer_value BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personality_answers TO authenticated;
GRANT ALL ON public.personality_answers TO service_role;
ALTER TABLE public.personality_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own answers select" ON public.personality_answers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own answers insert" ON public.personality_answers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own answers update" ON public.personality_answers FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own answers delete" ON public.personality_answers FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.personality_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ie_score int NOT NULL,
  sn_score int NOT NULL,
  ft_score int NOT NULL,
  jp_score int NOT NULL,
  mbti_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.personality_results TO authenticated;
GRANT ALL ON public.personality_results TO service_role;
ALTER TABLE public.personality_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own results read" ON public.personality_results FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.mbti_types (
  type_code text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  strengths jsonb NOT NULL DEFAULT '[]'::jsonb,
  weaknesses jsonb NOT NULL DEFAULT '[]'::jsonb
);
GRANT SELECT ON public.mbti_types TO authenticated, anon;
GRANT ALL ON public.mbti_types TO service_role;
ALTER TABLE public.mbti_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read types" ON public.mbti_types FOR SELECT USING (true);

-- ============ SEED QUESTIONS ============
INSERT INTO public.personality_questions (question_number, left_statement, right_statement, category) VALUES
(1,'I prefer quiet time alone','I prefer being around people','IE'),
(2,'I focus on concrete facts','I focus on abstract ideas','SN'),
(3,'I make decisions with my head','I make decisions with my heart','FT'),
(4,'I keep a tidy schedule','I go with the flow','JP'),
(5,'I gain energy from social events','I gain energy from solitude','IE'),
(6,'I love exploring possibilities','I prefer practical realities','SN'),
(7,'I value harmony above all','I value truth above all','FT'),
(8,'I am spontaneous','I plan ahead','JP'),
(9,'I think carefully before I speak','I speak as I think','IE'),
(10,'I trust experience','I trust imagination','SN'),
(11,'I am highly logical','I am highly compassionate','FT'),
(12,'I like to finish tasks early','I work best near deadlines','JP'),
(13,'I enjoy being the center of attention','I prefer staying in the background','IE'),
(14,'I often think about the future','I focus on the present moment','SN'),
(15,'I consider people''s feelings first','I consider the facts first','FT'),
(16,'I keep my options open','I make decisions quickly','JP'),
(17,'I have a few close friends','I have a wide social circle','IE'),
(18,'I prefer step-by-step instructions','I prefer the big picture','SN'),
(19,'I argue points objectively','I avoid conflict to keep peace','FT'),
(20,'I follow strict routines','I prefer flexibility','JP'),
(21,'I introduce myself to strangers easily','I wait to be introduced','IE'),
(22,'I enjoy theoretical discussions','I enjoy practical discussions','SN'),
(23,'I sympathize easily with others','I analyze situations critically','FT'),
(24,'I improvise as I go','I plan everything in advance','JP'),
(25,'I recharge by being alone','I recharge by being with others','IE'),
(26,'I notice details first','I notice patterns first','SN'),
(27,'I prefer fairness based on strict rules','I prefer fairness based on circumstances','FT'),
(28,'I keep detailed to-do lists','I trust my memory and instincts','JP'),
(29,'I find it easy to start conversations','I find it hard to start conversations','IE'),
(30,'I am drawn to novel ideas','I am drawn to proven methods','SN'),
(31,'I am tender-hearted','I am tough-minded','FT'),
(32,'I adapt easily to sudden changes','I prefer stability and predictability','JP'),
(33,'I keep my thoughts to myself','I share my thoughts openly','IE'),
(34,'I value tradition','I value innovation','SN'),
(35,'I prioritize efficiency','I prioritize relationships','FT'),
(36,'I consider myself organized','I consider myself flexible','JP'),
(37,'I enjoy large gatherings','I prefer small, intimate gatherings','IE'),
(38,'I rely on what I can see and touch','I rely on intuition and hunches','SN'),
(39,'I let emotions guide my choices','I let reason guide my choices','FT'),
(40,'I prefer structure','I prefer freedom','JP'),
(41,'I work best independently','I work best with others','IE'),
(42,'I prefer realistic stories','I prefer imaginative stories','SN'),
(43,'I focus on objective analysis','I focus on personal values','FT'),
(44,'I like clear rules','I like open possibilities','JP'),
(45,'I am outgoing','I am reserved','IE'),
(46,'I think literally','I think metaphorically','SN'),
(47,'I trust feelings over data','I trust data over feelings','FT'),
(48,'I finish one project before starting another','I juggle multiple projects at once','JP');

-- ============ SEED MBTI TYPES ============
INSERT INTO public.mbti_types (type_code, title, description, strengths, weaknesses) VALUES
('ISTJ','The Inspector','Practical, dependable, and grounded in tradition. ISTJs follow through on commitments with quiet determination.','["Responsible","Detail-oriented","Loyal","Organized"]','["Stubborn","Resistant to change","Overly formal"]'),
('ISFJ','The Protector','Warm, considerate, and devoted. ISFJs protect the people they care about with quiet steady effort.','["Supportive","Reliable","Patient","Observant"]','["Avoids conflict","Overworks","Takes things personally"]'),
('INFJ','The Counselor','Insightful, idealistic, and deeply caring. INFJs are guided by a strong inner vision.','["Insightful","Principled","Creative","Empathetic"]','["Perfectionist","Burns out easily","Overly private"]'),
('INTJ','The Mastermind','Strategic, independent, and driven. INTJs build long-range plans with calm precision.','["Strategic","Independent","Analytical","Determined"]','["Overly critical","Dismissive of emotions","Impatient"]'),
('ISTP','The Craftsman','Pragmatic, observant, and skilled with tools and systems. ISTPs love figuring out how things work.','["Practical","Logical","Adaptable","Hands-on"]','["Reserved","Risk-prone","Easily bored"]'),
('ISFP','The Composer','Gentle, artistic, and present in the moment. ISFPs express themselves through what they make and do.','["Creative","Compassionate","Flexible","Aesthetic"]','["Avoids conflict","Easily stressed","Unpredictable"]'),
('INFP','The Healer','Idealistic, imaginative, and guided by personal values. INFPs want their work to have meaning.','["Empathetic","Creative","Open-minded","Devoted"]','["Overly idealistic","Self-critical","Impractical"]'),
('INTP','The Architect','Curious, theoretical, and inventive. INTPs love untangling complex ideas.','["Analytical","Original","Open-minded","Logical"]','["Distracted","Insensitive","Indecisive"]'),
('ESTP','The Dynamo','Energetic, bold, and action-oriented. ESTPs thrive in fast-moving environments.','["Energetic","Perceptive","Bold","Practical"]','["Impatient","Risk-taking","Blunt"]'),
('ESFP','The Performer','Spontaneous, lively, and warm. ESFPs bring joy and energy to people around them.','["Enthusiastic","Friendly","Observant","Playful"]','["Easily distracted","Sensitive","Conflict-averse"]'),
('ENFP','The Champion','Enthusiastic, imaginative, and people-loving. ENFPs see possibility everywhere.','["Charismatic","Creative","Curious","Encouraging"]','["Disorganized","Overcommits","Stress-sensitive"]'),
('ENTP','The Visionary','Quick-witted, inventive, and intellectually playful. ENTPs love debate and big ideas.','["Innovative","Adaptable","Confident","Quick-thinking"]','["Argumentative","Inconsistent","Easily bored"]'),
('ESTJ','The Supervisor','Decisive, organized, and grounded in results. ESTJs run the systems people rely on.','["Organized","Decisive","Loyal","Direct"]','["Inflexible","Judgmental","Impatient"]'),
('ESFJ','The Provider','Warm, organized, and committed to the well-being of others. ESFJs build strong communities.','["Caring","Loyal","Organized","Cooperative"]','["Needs approval","Avoids conflict","Inflexible"]'),
('ENFJ','The Teacher','Charismatic, empathetic, and naturally inspiring. ENFJs help others grow.','["Inspiring","Empathetic","Reliable","Persuasive"]','["Overinvolved","Approval-seeking","Self-sacrificing"]'),
('ENTJ','The Commander','Bold, strategic, and driven to lead. ENTJs turn vision into structured action.','["Strategic","Confident","Decisive","Efficient"]','["Domineering","Impatient","Cold"]');

-- ============ SCORING FUNCTION ============
CREATE OR REPLACE FUNCTION public.submit_personality_assessment(_answers jsonb)
RETURNS public.personality_results
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  a int[];
  i int;
  ie int := 0; sn int := 0; ft int := 0; jp int := 0;
  mbti text;
  res public.personality_results;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
  IF jsonb_typeof(_answers) <> 'array' OR jsonb_array_length(_answers) <> 48 THEN
    RAISE EXCEPTION 'invalid_answers';
  END IF;

  a := ARRAY[]::int[];
  FOR i IN 0..47 LOOP
    a := a || ((_answers->i)::int);
    IF a[i+1] < 1 OR a[i+1] > 5 THEN RAISE EXCEPTION 'invalid_answer_value'; END IF;
  END LOOP;

  ie := a[1] + (6-a[5]) + a[9] + (6-a[13]) + a[17] + (6-a[21]) + a[25] + (6-a[29]) + a[33] + (6-a[37]) + a[41] + (6-a[45]);
  sn := a[2] + (6-a[6]) + a[10] + (6-a[14]) + a[18] + (6-a[22]) + a[26] + (6-a[30]) + a[34] + a[38] + a[42] + a[46];
  ft := (6-a[3]) + a[7] + (6-a[11]) + a[15] + (6-a[19]) + a[23] + (6-a[27]) + a[31] + (6-a[35]) + a[39] + (6-a[43]) + a[47];
  jp := a[4] + (6-a[8]) + a[12] + (6-a[16]) + a[20] + (6-a[24]) + a[28] + (6-a[32]) + a[36] + a[40] + a[44] + a[48];

  mbti := (CASE WHEN ie > 36 THEN 'E' ELSE 'I' END)
       || (CASE WHEN sn > 36 THEN 'N' ELSE 'S' END)
       || (CASE WHEN ft > 36 THEN 'T' ELSE 'F' END)
       || (CASE WHEN jp > 36 THEN 'P' ELSE 'J' END);

  INSERT INTO public.personality_results(user_id, ie_score, sn_score, ft_score, jp_score, mbti_type)
    VALUES (uid, ie, sn, ft, jp, mbti)
    RETURNING * INTO res;

  RETURN res;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_personality_assessment(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_personality_assessment(jsonb) TO authenticated;
