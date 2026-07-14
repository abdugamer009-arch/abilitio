-- ============ Majors for every career ============
-- Career results now show the recommended university major next to each
-- job match (attachMajorsToCareers in career-engine.ts picks the linked
-- major the user scores highest on). For that to work, every career key
-- must appear in at least one major's related_career_keys.
--
-- This migration:
--   1. rewrites related_career_keys of the existing majors to include the
--      expanded careers catalog (idempotent full-array updates)
--   2. adds new majors covering fields the original 30 didn't (trades,
--      aviation, hospitality, agriculture, public safety, social sciences...)

-- ---------- 1. Update existing majors ----------
UPDATE public.university_majors SET related_career_keys='{software_engineer,data_scientist,ai_engineer,cybersecurity,frontend_developer,mobile_developer,devops_engineer,cloud_architect,data_engineer,game_developer,qa_engineer,database_admin,network_engineer,it_support,blockchain_developer,robotics_engineer}' WHERE key='cs';
UPDATE public.university_majors SET related_career_keys='{software_engineer,ai_engineer,frontend_developer,mobile_developer,devops_engineer,qa_engineer,game_developer,cloud_architect}' WHERE key='software_eng';
UPDATE public.university_majors SET related_career_keys='{ai_engineer,data_scientist,robotics_engineer,data_engineer,quant_analyst}' WHERE key='ai';
UPDATE public.university_majors SET related_career_keys='{data_scientist,business_analyst,data_engineer,statistician,quant_analyst,sports_analyst,seo_specialist}' WHERE key='data_sci';
UPDATE public.university_majors SET related_career_keys='{mech_engineer,aerospace_engineer,automotive_engineer,mechatronics_engineer,robotics_engineer,materials_engineer,industrial_engineer}' WHERE key='mech_eng';
UPDATE public.university_majors SET related_career_keys='{civil_engineer,architect,construction_manager,surveyor}' WHERE key='civil_eng';
UPDATE public.university_majors SET related_career_keys='{electrical_engineer,mechatronics_engineer,energy_engineer,robotics_engineer,network_engineer}' WHERE key='electrical_eng';
UPDATE public.university_majors SET related_career_keys='{biomedical_engineer,medical_lab_tech,radiologic_tech}' WHERE key='biomed';
UPDATE public.university_majors SET related_career_keys='{physician,surgeon,psychiatrist}' WHERE key='medicine';
UPDATE public.university_majors SET related_career_keys='{nurse,midwife,paramedic}' WHERE key='nursing';
UPDATE public.university_majors SET related_career_keys='{pharmacist}' WHERE key='pharmacy';
UPDATE public.university_majors SET related_career_keys='{psychologist,school_counselor,psychiatrist}' WHERE key='psychology';
UPDATE public.university_majors SET related_career_keys='{biologist,research_scientist,marine_biologist,geneticist,neuroscientist,veterinarian}' WHERE key='biology';
UPDATE public.university_majors SET related_career_keys='{chemist,pharmacist,chemical_engineer,food_scientist}' WHERE key='chemistry';
UPDATE public.university_majors SET related_career_keys='{physicist,research_scientist,astronomer,materials_engineer}' WHERE key='physics';
UPDATE public.university_majors SET related_career_keys='{environmental_scientist,environmental_engineer,meteorologist,forester,geologist}' WHERE key='env_sci';
UPDATE public.university_majors SET related_career_keys='{business_analyst,mgmt_consultant,marketing_manager,operations_manager,project_manager,hr_manager,sales_manager,business_dev,real_estate_agent,franchise_owner,ecommerce_founder,product_manager}' WHERE key='business';
UPDATE public.university_majors SET related_career_keys='{financial_analyst,policy_analyst,business_analyst,economist}' WHERE key='economics';
UPDATE public.university_majors SET related_career_keys='{financial_analyst,investment_banker,accountant,actuary,auditor,tax_advisor,insurance_underwriter,quant_analyst}' WHERE key='finance';
UPDATE public.university_majors SET related_career_keys='{marketing_manager,digital_marketer,smm_manager,pr_specialist,copywriter,brand_manager,seo_specialist,content_creator}' WHERE key='marketing';
UPDATE public.university_majors SET related_career_keys='{lawyer,policy_analyst,diplomat,prosecutor,notary}' WHERE key='law';
UPDATE public.university_majors SET related_career_keys='{policy_analyst,diplomat,lawyer,public_administrator,ngo_manager}' WHERE key='political_sci';
UPDATE public.university_majors SET related_career_keys='{teacher,professor,coach,special_ed_teacher,kindergarten_teacher,school_counselor,librarian}' WHERE key='education';
UPDATE public.university_majors SET related_career_keys='{architect,interior_designer,landscape_architect,urban_planner}' WHERE key='architecture';
UPDATE public.university_majors SET related_career_keys='{ux_designer,graphic_designer,architect,interior_designer,fashion_designer,industrial_designer,animator,illustrator,game_designer,art_director,startup_product_designer}' WHERE key='design';
UPDATE public.university_majors SET related_career_keys='{journalist,editor_publisher,tv_presenter,pr_specialist}' WHERE key='journalism';
UPDATE public.university_majors SET related_career_keys='{film_director,journalist,video_editor,animator,content_creator,photographer}' WHERE key='film';
UPDATE public.university_majors SET related_career_keys='{musician}' WHERE key='music';
UPDATE public.university_majors SET related_career_keys='{athlete,coach,personal_trainer,physiotherapist_sport,sports_analyst,esports_professional,dancer}' WHERE key='sports_sci';
UPDATE public.university_majors SET related_career_keys='{diplomat,policy_analyst,ngo_manager}' WHERE key='intl_relations';

-- ---------- 2. New majors ----------
INSERT INTO public.university_majors (key, name, category, related_career_keys, required_traits, required_profile, required_interests) VALUES
('statistics','Statistics','Science','{statistician,actuary,data_scientist,quant_analyst}','{"T":2,"J":1,"I":1}','{Analytical,Research}','{science,finance,technology}'),
('mathematics','Mathematics','Science','{mathematician,actuary,quant_analyst,physicist}','{"T":2,"N":2,"I":2}','{Analytical,Research}','{science,technology}'),
('dentistry','Dentistry','Healthcare','{dentist}','{"S":2,"J":2,"T":1}','{Practical,Analytical}','{healthcare,science}'),
('vet_medicine','Veterinary Medicine','Healthcare','{veterinarian}','{"F":2,"S":2}','{Practical,Research}','{healthcare,science,environment}'),
('allied_health','Allied Health & Rehabilitation','Healthcare','{physical_therapist,occupational_therapist,speech_therapist,dietitian,radiologic_tech,optometrist,medical_lab_tech,paramedic}','{"F":2,"S":2}','{Practical}','{healthcare,sports}'),
('earth_sci','Earth Sciences & Geology','Science','{geologist,meteorologist,petroleum_engineer,mining_engineer}','{"T":1,"S":1,"I":1}','{Research,Practical}','{science,environment,engineering}'),
('linguistics','Linguistics & Languages','Social Sciences','{linguist,translator}','{"I":2,"N":1,"T":1}','{Research,Analytical}','{education,journalism}'),
('history','History','Social Sciences','{historian,archaeologist,librarian}','{"I":2,"N":1,"J":1}','{Research}','{education,politics,arts}'),
('sociology','Sociology & Social Work','Social Sciences','{sociologist,social_worker,ngo_manager}','{"F":2,"N":1,"E":1}','{Research,Practical}','{psychology,politics,education}'),
('hospitality_mgmt','Hospitality & Tourism Management','Hospitality','{hotel_manager,restaurant_manager,event_planner,tour_guide,flight_attendant}','{"E":2,"S":1,"J":1,"F":1}','{Practical,Strategic}','{business,marketing}'),
('culinary_arts','Culinary Arts','Hospitality','{chef,pastry_chef}','{"S":2,"P":1}','{Practical,Innovative}','{arts,entrepreneurship}'),
('aviation','Aviation & Aeronautics','Aviation','{pilot,air_traffic_controller,aerospace_engineer}','{"S":2,"T":2,"J":2}','{Practical,Analytical}','{engineering,technology}'),
('logistics','Logistics & Supply Chain','Business','{supply_chain_manager,logistics_coordinator,maritime_officer,operations_manager}','{"S":1,"T":1,"J":2}','{Strategic,Practical}','{business,finance}'),
('agronomy','Agronomy & Agriculture','Agriculture','{agronomist,agribusiness_manager,forester,agricultural_engineer,food_scientist}','{"S":2,"T":1}','{Practical,Research}','{environment,science,business}'),
('criminology','Criminology & Security Studies','Public Safety','{detective,police_officer,military_officer,firefighter,cybersecurity}','{"S":1,"T":1,"J":2}','{Practical,Analytical}','{law,politics,sports}'),
('public_admin','Public Administration','Government','{public_administrator,urban_planner,policy_analyst,ngo_manager}','{"E":1,"T":1,"J":2}','{Strategic,Practical}','{politics,law,business}'),
('applied_trades','Applied Engineering & Skilled Trades','Trades','{electrician,plumber,carpenter,welder,auto_mechanic,hvac_technician,construction_manager,surveyor}','{"S":2,"T":1,"P":1}','{Practical}','{engineering,technology}'),
('media_production','Media Production & Communication','Media','{video_editor,photographer,tv_presenter,content_creator,smm_manager,editor_publisher}','{"E":1,"N":1,"P":1}','{Innovative,Practical}','{arts,journalism,marketing,design}'),
('performing_arts','Performing Arts','Arts','{actor,dancer,musician,film_director}','{"E":1,"N":1,"F":1,"P":2}','{Innovative}','{arts,sports}'),
('fashion_design','Fashion & Textile Design','Design','{fashion_designer,illustrator}','{"N":2,"F":1,"P":2}','{Innovative}','{design,arts,entrepreneurship}'),
('hr_mgmt','Human Resource Management','Business','{hr_manager,operations_manager}','{"E":2,"F":2,"J":1}','{Strategic,Practical}','{business,psychology}'),
('entrepreneurship','Entrepreneurship & Innovation','Entrepreneurship','{entrepreneur,ecommerce_founder,social_entrepreneur,franchise_owner,startup_product_designer,business_dev}','{"E":2,"N":2,"P":1}','{Strategic,Innovative}','{entrepreneurship,business}')
ON CONFLICT (key) DO NOTHING;
