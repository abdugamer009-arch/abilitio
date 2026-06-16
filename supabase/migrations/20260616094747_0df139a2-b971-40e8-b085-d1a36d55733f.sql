
-- ============ Career Intelligence platform ============

-- Careers catalog
CREATE TABLE public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  salary_min integer DEFAULT 0,
  salary_max integer DEFAULT 0,
  demand_score integer DEFAULT 70,
  required_traits jsonb DEFAULT '{}'::jsonb,
  required_profile text[] DEFAULT ARRAY[]::text[],
  required_interests text[] DEFAULT ARRAY[]::text[],
  required_skills text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.careers TO anon, authenticated;
GRANT ALL ON public.careers TO service_role;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "careers public read" ON public.careers FOR SELECT USING (true);

CREATE TABLE public.university_majors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  related_career_keys text[] DEFAULT ARRAY[]::text[],
  required_traits jsonb DEFAULT '{}'::jsonb,
  required_profile text[] DEFAULT ARRAY[]::text[],
  required_interests text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.university_majors TO anon, authenticated;
GRANT ALL ON public.university_majors TO service_role;
ALTER TABLE public.university_majors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "majors public read" ON public.university_majors FOR SELECT USING (true);

-- Career assessment answers (raw)
CREATE TABLE public.career_assessment_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.career_assessment_answers TO authenticated;
GRANT ALL ON public.career_assessment_answers TO service_role;
ALTER TABLE public.career_assessment_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "answers own select" ON public.career_assessment_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "answers own insert" ON public.career_assessment_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Career assessment results
CREATE TABLE public.career_assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  personality_type text,
  work_style text,
  leadership_style text,
  learning_style text,
  team_style text,
  cognitive_score integer,
  cognitive_tier text,
  cognitive_profile text,
  interests jsonb DEFAULT '[]'::jsonb,
  career_matches jsonb DEFAULT '[]'::jsonb,
  university_matches jsonb DEFAULT '[]'::jsonb,
  strengths jsonb DEFAULT '[]'::jsonb,
  improvements jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.career_assessment_results TO authenticated;
GRANT ALL ON public.career_assessment_results TO service_role;
ALTER TABLE public.career_assessment_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results own select" ON public.career_assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "results own insert" ON public.career_assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
-- principals can see results of their school members
CREATE POLICY "results principal select" ON public.career_assessment_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.school_members sm
    JOIN public.schools s ON s.id = sm.school_id
    WHERE sm.user_id = career_assessment_results.user_id AND s.owner_user_id = auth.uid()
  ));

CREATE INDEX career_results_user_idx ON public.career_assessment_results(user_id, created_at DESC);

-- School staff (extended roles beyond principal)
CREATE TABLE public.school_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  role text NOT NULL CHECK (role IN ('principal','vice_principal','counselor','psychologist','teacher')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_users TO authenticated;
GRANT ALL ON public.school_users TO service_role;
ALTER TABLE public.school_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "school_users principal manage" ON public.school_users FOR ALL
  USING (public.is_school_principal(auth.uid(), school_id))
  WITH CHECK (public.is_school_principal(auth.uid(), school_id));

-- Add focus_key to specialized classes
ALTER TABLE public.school_specialized_classes ADD COLUMN IF NOT EXISTS focus_key text;

-- RPC: persist a class built by AI (principal only)
CREATE OR REPLACE FUNCTION public.school_save_specialized_class(
  _school uuid, _title text, _focus text, _focus_key text, _reason text, _students uuid[]
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.is_school_principal(auth.uid(), _school) THEN RAISE EXCEPTION 'forbidden'; END IF;
  INSERT INTO public.school_specialized_classes(school_id, title, focus, focus_key, reason, student_user_ids, created_by)
    VALUES (_school, _title, _focus, _focus_key, _reason, _students, auth.uid())
    RETURNING id INTO new_id;
  RETURN new_id;
END $$;

-- Seed careers (curated set — expandable)
INSERT INTO public.careers (key, name, category, description, salary_min, salary_max, demand_score, required_traits, required_profile, required_interests, required_skills) VALUES
('software_engineer','Software Engineer','Technology','Design and build software systems.',70000,180000,95,'{"T":2,"N":2,"J":1,"I":1}','{Analytical,Strategic,Innovative}','{technology,engineering}','{Programming,Problem Solving,Algorithms}'),
('data_scientist','Data Scientist','Technology','Extract insights from complex data.',85000,200000,94,'{"T":2,"N":2,"I":1}','{Analytical,Research}','{technology,science}','{Statistics,Python,ML}'),
('ai_engineer','AI Engineer','Technology','Build machine learning systems.',95000,230000,98,'{"T":2,"N":2}','{Analytical,Innovative,Research}','{technology,science,engineering}','{ML,Python,Math}'),
('cybersecurity','Cybersecurity Analyst','Technology','Protect systems from threats.',75000,170000,93,'{"T":2,"J":2}','{Analytical,Strategic}','{technology}','{Security,Networking}'),
('product_manager','Product Manager','Business','Lead product strategy and delivery.',90000,200000,90,'{"E":2,"N":2,"J":2}','{Strategic}','{business,technology}','{Strategy,Communication}'),
('mech_engineer','Mechanical Engineer','Engineering','Design mechanical systems.',65000,140000,85,'{"T":2,"S":1,"J":1}','{Analytical,Practical}','{engineering,science}','{CAD,Physics}'),
('civil_engineer','Civil Engineer','Engineering','Design infrastructure.',60000,130000,82,'{"T":2,"S":2,"J":2}','{Practical,Analytical}','{engineering,architecture,environment}','{Structural Analysis}'),
('electrical_engineer','Electrical Engineer','Engineering','Design electrical systems.',70000,150000,87,'{"T":2,"N":1}','{Analytical,Innovative}','{engineering,technology}','{Circuits,Math}'),
('aerospace_engineer','Aerospace Engineer','Engineering','Design aircraft & spacecraft.',80000,170000,84,'{"T":2,"N":2,"J":1}','{Analytical,Innovative,Research}','{engineering,science}','{Physics,CAD}'),
('biomedical_engineer','Biomedical Engineer','Engineering','Engineer medical devices.',75000,160000,88,'{"T":2,"N":1}','{Analytical,Research}','{engineering,healthcare,science}','{Biology,CAD}'),
('physician','Physician','Healthcare','Diagnose and treat patients.',180000,400000,92,'{"F":1,"S":2,"J":2}','{Analytical,Research,Strategic}','{healthcare,science}','{Medicine,Empathy}'),
('surgeon','Surgeon','Healthcare','Perform surgical procedures.',250000,550000,90,'{"T":1,"S":2,"J":2}','{Strategic,Analytical}','{healthcare,science}','{Precision,Anatomy}'),
('nurse','Registered Nurse','Healthcare','Patient care and treatment.',55000,110000,93,'{"F":2,"S":2,"J":1}','{Practical}','{healthcare}','{Care,Communication}'),
('pharmacist','Pharmacist','Healthcare','Dispense medication & advise patients.',95000,140000,80,'{"T":1,"S":2,"J":2}','{Analytical,Practical}','{healthcare,science}','{Chemistry}'),
('psychologist','Clinical Psychologist','Psychology','Mental health assessment & therapy.',70000,150000,85,'{"F":2,"N":1,"I":1}','{Research,Analytical}','{psychology,healthcare}','{Empathy,Research}'),
('research_scientist','Research Scientist','Science','Lead scientific research.',75000,170000,87,'{"T":2,"N":2,"I":2}','{Research,Analytical,Innovative}','{science,technology}','{Research,Statistics}'),
('biologist','Biologist','Science','Study living organisms.',55000,110000,75,'{"T":1,"S":1,"I":1}','{Research,Analytical}','{science,environment,healthcare}','{Biology,Lab}'),
('chemist','Chemist','Science','Study matter & reactions.',60000,130000,76,'{"T":2,"N":1}','{Research,Analytical}','{science}','{Chemistry,Lab}'),
('physicist','Physicist','Science','Study fundamental laws of nature.',75000,160000,80,'{"T":2,"N":2,"I":2}','{Research,Analytical,Innovative}','{science}','{Math,Physics}'),
('environmental_scientist','Environmental Scientist','Science','Study & protect environment.',60000,120000,82,'{"T":1,"N":1}','{Research,Practical}','{environment,science}','{Field Research}'),
('business_analyst','Business Analyst','Business','Analyze business operations.',70000,140000,88,'{"T":2,"J":1}','{Analytical,Strategic}','{business,finance}','{Excel,SQL}'),
('mgmt_consultant','Management Consultant','Business','Advise organizations on strategy.',95000,220000,86,'{"E":2,"T":1,"J":1}','{Strategic,Analytical}','{business}','{Strategy,Communication}'),
('entrepreneur','Entrepreneur','Entrepreneurship','Found & scale ventures.',0,1000000,90,'{"E":2,"N":2,"P":1}','{Strategic,Innovative}','{entrepreneurship,business}','{Leadership,Risk}'),
('financial_analyst','Financial Analyst','Finance','Analyze investments & finance.',70000,150000,87,'{"T":2,"J":2}','{Analytical,Strategic}','{finance,business}','{Modeling,Excel}'),
('investment_banker','Investment Banker','Finance','Capital markets advisory.',120000,400000,82,'{"T":2,"J":2,"E":1}','{Strategic,Analytical}','{finance,business}','{Modeling}'),
('accountant','Accountant','Finance','Manage financial records.',55000,110000,78,'{"T":1,"S":2,"J":2}','{Analytical,Practical}','{finance,business}','{Accounting}'),
('marketing_manager','Marketing Manager','Business','Lead marketing strategy.',75000,160000,84,'{"E":2,"N":2}','{Strategic,Innovative}','{marketing,business}','{Branding}'),
('ux_designer','UX Designer','Design','Design user experiences.',75000,160000,89,'{"N":2,"F":1,"P":1}','{Innovative}','{design,technology}','{Figma,Research}'),
('graphic_designer','Graphic Designer','Design','Create visual content.',45000,95000,75,'{"N":2,"F":1,"P":1}','{Innovative}','{design,arts}','{Adobe Suite}'),
('architect','Architect','Architecture','Design buildings & spaces.',70000,150000,82,'{"N":2,"J":1}','{Innovative,Practical,Strategic}','{architecture,design,engineering}','{CAD,Design}'),
('journalist','Journalist','Media','Report news & stories.',45000,100000,72,'{"E":2,"N":2,"P":1}','{Innovative,Research}','{journalism,politics}','{Writing,Research}'),
('lawyer','Lawyer','Law','Legal advisory & litigation.',90000,250000,80,'{"T":2,"J":2,"E":1}','{Analytical,Strategic}','{law,politics}','{Argumentation,Research}'),
('teacher','Teacher','Education','Educate students.',45000,90000,84,'{"F":1,"S":1,"J":1}','{Practical}','{education,psychology}','{Communication,Patience}'),
('professor','University Professor','Education','Teach & research at university.',75000,180000,80,'{"N":2,"T":1,"I":1}','{Research,Analytical}','{education,science}','{Research,Teaching}'),
('diplomat','Diplomat','Government','Represent country abroad.',70000,160000,72,'{"E":2,"N":1,"F":1}','{Strategic}','{politics,law}','{Languages,Negotiation}'),
('athlete','Professional Athlete','Sports','Compete at elite level.',40000,1000000,70,'{"S":1,"P":1,"E":1}','{Practical}','{sports}','{Discipline,Fitness}'),
('coach','Sports Coach','Sports','Train athletes & teams.',45000,150000,73,'{"E":2,"F":1,"J":1}','{Practical,Strategic}','{sports,education}','{Leadership}'),
('film_director','Film Director','Arts','Direct films & shows.',60000,300000,75,'{"N":2,"P":1,"E":1}','{Innovative,Strategic}','{arts,design}','{Storytelling,Leadership}'),
('musician','Musician','Arts','Create & perform music.',30000,200000,68,'{"N":1,"F":1,"P":1}','{Innovative}','{arts}','{Performance}'),
('policy_analyst','Policy Analyst','Government','Analyze public policy.',65000,140000,78,'{"T":2,"N":1,"J":1}','{Analytical,Research,Strategic}','{politics,law,education}','{Research,Writing}')
ON CONFLICT (key) DO NOTHING;

-- Seed university majors
INSERT INTO public.university_majors (key, name, category, related_career_keys, required_traits, required_profile, required_interests) VALUES
('cs','Computer Science','Technology','{software_engineer,data_scientist,ai_engineer,cybersecurity}','{"T":2,"N":2}','{Analytical,Innovative}','{technology,engineering}'),
('software_eng','Software Engineering','Technology','{software_engineer,ai_engineer}','{"T":2,"N":1,"J":1}','{Analytical,Strategic}','{technology,engineering}'),
('ai','Artificial Intelligence','Technology','{ai_engineer,data_scientist}','{"T":2,"N":2,"I":1}','{Analytical,Research,Innovative}','{technology,science}'),
('data_sci','Data Science','Technology','{data_scientist,business_analyst}','{"T":2,"N":1}','{Analytical,Research}','{technology,business}'),
('mech_eng','Mechanical Engineering','Engineering','{mech_engineer,aerospace_engineer}','{"T":2,"S":1}','{Analytical,Practical}','{engineering,science}'),
('civil_eng','Civil Engineering','Engineering','{civil_engineer,architect}','{"T":2,"S":2,"J":2}','{Practical,Analytical}','{engineering,architecture}'),
('electrical_eng','Electrical Engineering','Engineering','{electrical_engineer}','{"T":2,"N":1}','{Analytical}','{engineering,technology}'),
('biomed','Biomedical Engineering','Engineering','{biomedical_engineer}','{"T":2,"N":1}','{Analytical,Research}','{engineering,healthcare}'),
('medicine','Medicine','Healthcare','{physician,surgeon}','{"S":2,"J":2,"F":1}','{Analytical,Strategic,Research}','{healthcare,science}'),
('nursing','Nursing','Healthcare','{nurse}','{"F":2,"S":2,"J":1}','{Practical}','{healthcare}'),
('pharmacy','Pharmacy','Healthcare','{pharmacist}','{"T":1,"S":2,"J":2}','{Analytical}','{healthcare,science}'),
('psychology','Psychology','Psychology','{psychologist}','{"F":2,"N":1}','{Research,Analytical}','{psychology,healthcare}'),
('biology','Biology','Science','{biologist,research_scientist}','{"T":1,"S":1,"I":1}','{Research,Analytical}','{science,environment}'),
('chemistry','Chemistry','Science','{chemist,pharmacist}','{"T":2,"N":1}','{Research,Analytical}','{science}'),
('physics','Physics','Science','{physicist,research_scientist}','{"T":2,"N":2,"I":2}','{Research,Analytical,Innovative}','{science}'),
('env_sci','Environmental Science','Science','{environmental_scientist}','{"T":1,"N":1}','{Research,Practical}','{environment,science}'),
('business','Business Administration','Business','{business_analyst,mgmt_consultant,marketing_manager}','{"E":1,"T":1,"J":1}','{Strategic}','{business}'),
('economics','Economics','Business','{financial_analyst,policy_analyst,business_analyst}','{"T":2,"N":1,"J":1}','{Analytical,Strategic}','{business,finance,politics}'),
('finance','Finance','Business','{financial_analyst,investment_banker,accountant}','{"T":2,"J":2}','{Analytical,Strategic}','{finance,business}'),
('marketing','Marketing','Business','{marketing_manager}','{"E":2,"N":2}','{Innovative,Strategic}','{marketing,business}'),
('law','Law','Law','{lawyer,policy_analyst,diplomat}','{"T":2,"J":2,"E":1}','{Analytical,Strategic}','{law,politics}'),
('political_sci','Political Science','Government','{policy_analyst,diplomat,lawyer}','{"T":1,"N":1,"J":1}','{Strategic,Research}','{politics,law}'),
('education','Education','Education','{teacher,professor,coach}','{"F":1,"S":1,"J":1}','{Practical}','{education,psychology}'),
('architecture','Architecture','Architecture','{architect}','{"N":2,"J":1}','{Innovative,Practical,Strategic}','{architecture,design,engineering}'),
('design','Design','Design','{ux_designer,graphic_designer,architect}','{"N":2,"F":1,"P":1}','{Innovative}','{design,arts}'),
('journalism','Journalism','Media','{journalist}','{"E":2,"N":2,"P":1}','{Innovative,Research}','{journalism,politics}'),
('film','Film & Media Arts','Arts','{film_director,journalist}','{"N":2,"P":1,"E":1}','{Innovative}','{arts,design}'),
('music','Music','Arts','{musician}','{"N":1,"F":1,"P":1}','{Innovative}','{arts}'),
('sports_sci','Sports Science','Sports','{athlete,coach}','{"S":1,"E":1,"P":1}','{Practical}','{sports,healthcare}'),
('intl_relations','International Relations','Government','{diplomat,policy_analyst}','{"E":2,"N":1,"F":1}','{Strategic,Research}','{politics,law}')
ON CONFLICT (key) DO NOTHING;
