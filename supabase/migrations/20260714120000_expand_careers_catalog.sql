-- ============ Expand careers catalog ============
-- Adds ~100 careers across technology, engineering, healthcare, science,
-- business, finance, media, design, education, law, government, trades,
-- aviation, agriculture, hospitality, and sports.
--
-- Every row is tuned for the matching engine (career-engine.ts):
--   required_traits    -> MBTI letter weights (personality fit, 40%)
--   required_profile   -> cognitive profiles from the IQ section (35%):
--                         Analytical | Strategic | Practical | Research | Innovative
--   required_interests -> interest keys from the assessment (25%):
--                         technology, engineering, science, healthcare, business,
--                         finance, entrepreneurship, marketing, design, arts,
--                         journalism, law, politics, education, psychology,
--                         sports, architecture, environment

INSERT INTO public.careers (key, name, category, description, salary_min, salary_max, demand_score, required_traits, required_profile, required_interests, required_skills) VALUES

-- ---------- Technology ----------
('frontend_developer','Frontend Developer','Technology','Build user interfaces for web applications.',60000,150000,90,'{"T":1,"N":2,"P":1}','{Innovative,Analytical}','{technology,design}','{JavaScript,React,CSS}'),
('mobile_developer','Mobile App Developer','Technology','Create iOS and Android applications.',65000,160000,88,'{"T":2,"N":1,"I":1}','{Analytical,Innovative}','{technology,engineering}','{Swift,Kotlin,UI}'),
('devops_engineer','DevOps Engineer','Technology','Automate deployment and infrastructure.',85000,180000,92,'{"T":2,"J":2,"I":1}','{Analytical,Practical}','{technology,engineering}','{CI/CD,Cloud,Linux}'),
('cloud_architect','Cloud Architect','Technology','Design scalable cloud infrastructure.',110000,220000,91,'{"T":2,"N":2,"J":1}','{Strategic,Analytical}','{technology,engineering}','{AWS,Architecture,Networking}'),
('data_engineer','Data Engineer','Technology','Build data pipelines and warehouses.',85000,180000,93,'{"T":2,"J":1,"I":1}','{Analytical,Practical}','{technology,science}','{SQL,Python,ETL}'),
('game_developer','Game Developer','Technology','Program video games and interactive worlds.',55000,140000,78,'{"T":1,"N":2,"P":1}','{Innovative,Analytical}','{technology,arts,design}','{Unity,C++,Game Design}'),
('qa_engineer','QA Engineer','Technology','Test software and guard product quality.',55000,120000,80,'{"S":2,"T":1,"J":2}','{Practical,Analytical}','{technology}','{Testing,Automation,Attention to Detail}'),
('database_admin','Database Administrator','Technology','Maintain and optimize databases.',70000,140000,76,'{"S":2,"T":2,"J":2,"I":1}','{Practical,Analytical}','{technology}','{SQL,Backup,Performance Tuning}'),
('network_engineer','Network Engineer','Technology','Design and run computer networks.',65000,140000,82,'{"S":1,"T":2,"J":1}','{Practical,Analytical}','{technology,engineering}','{Routing,Firewalls,Protocols}'),
('it_support','IT Support Specialist','Technology','Help people solve technical problems.',40000,80000,79,'{"S":2,"F":1,"J":1,"E":1}','{Practical}','{technology}','{Troubleshooting,Communication}'),
('blockchain_developer','Blockchain Developer','Technology','Build decentralized applications.',90000,200000,74,'{"T":2,"N":2,"I":1}','{Innovative,Analytical}','{technology,finance}','{Solidity,Cryptography}'),
('robotics_engineer','Robotics Engineer','Technology','Design and program robots.',80000,170000,86,'{"T":2,"N":2}','{Innovative,Analytical,Practical}','{technology,engineering,science}','{Control Systems,CAD,Programming}'),

-- ---------- Engineering ----------
('chemical_engineer','Chemical Engineer','Engineering','Design chemical processes and plants.',70000,150000,80,'{"T":2,"S":1,"J":1}','{Analytical,Practical}','{engineering,science}','{Chemistry,Process Design}'),
('industrial_engineer','Industrial Engineer','Engineering','Optimize production systems.',65000,135000,83,'{"T":2,"S":1,"J":2}','{Analytical,Strategic,Practical}','{engineering,business}','{Lean,Optimization}'),
('petroleum_engineer','Petroleum Engineer','Engineering','Extract oil and gas resources.',90000,200000,72,'{"T":2,"S":2,"J":1}','{Analytical,Practical}','{engineering,science}','{Geology,Drilling}'),
('mining_engineer','Mining Engineer','Engineering','Plan safe extraction of minerals.',75000,160000,74,'{"T":2,"S":2,"J":2}','{Practical,Analytical}','{engineering,environment}','{Geotechnics,Safety}'),
('automotive_engineer','Automotive Engineer','Engineering','Develop vehicles and mobility systems.',65000,140000,78,'{"T":2,"S":1}','{Analytical,Practical,Innovative}','{engineering,technology}','{CAD,Mechanics}'),
('energy_engineer','Renewable Energy Engineer','Engineering','Design solar, wind, and clean-energy systems.',70000,150000,90,'{"T":2,"N":1,"J":1}','{Analytical,Innovative,Practical}','{engineering,environment,science}','{Energy Systems,Sustainability}'),
('mechatronics_engineer','Mechatronics Engineer','Engineering','Combine mechanics, electronics, and software.',70000,150000,85,'{"T":2,"N":1}','{Analytical,Innovative}','{engineering,technology}','{Electronics,Programming,CAD}'),
('environmental_engineer','Environmental Engineer','Engineering','Engineer solutions for pollution and waste.',65000,130000,84,'{"T":1,"N":1,"J":1}','{Practical,Analytical,Research}','{environment,engineering,science}','{Water Systems,Regulations}'),
('agricultural_engineer','Agricultural Engineer','Engineering','Modernize farming with technology.',60000,120000,77,'{"T":1,"S":2,"J":1}','{Practical,Analytical}','{engineering,environment}','{Irrigation,Machinery}'),
('materials_engineer','Materials Engineer','Engineering','Develop metals, polymers, and composites.',70000,140000,75,'{"T":2,"N":1,"I":1}','{Research,Analytical}','{engineering,science}','{Materials Science,Testing}'),

-- ---------- Healthcare ----------
('dentist','Dentist','Healthcare','Diagnose and treat oral health.',120000,250000,85,'{"S":2,"J":2,"T":1}','{Practical,Analytical}','{healthcare,science}','{Precision,Patient Care}'),
('veterinarian','Veterinarian','Healthcare','Care for animal health.',75000,160000,80,'{"F":2,"S":2,"I":1}','{Practical,Research}','{healthcare,science,environment}','{Animal Medicine,Empathy}'),
('physical_therapist','Physical Therapist','Healthcare','Restore movement and manage pain.',65000,110000,88,'{"F":2,"S":2,"E":1}','{Practical}','{healthcare,sports}','{Anatomy,Rehabilitation}'),
('dietitian','Dietitian / Nutritionist','Healthcare','Guide nutrition and healthy eating.',50000,95000,81,'{"F":1,"S":2,"J":1}','{Practical,Research}','{healthcare,science,sports}','{Nutrition Science,Coaching}'),
('paramedic','Paramedic','Healthcare','Deliver emergency medical care.',40000,75000,86,'{"S":2,"P":2,"E":1,"T":1}','{Practical}','{healthcare}','{Emergency Medicine,Calm Under Pressure}'),
('medical_lab_tech','Medical Laboratory Technologist','Healthcare','Run diagnostic laboratory tests.',50000,90000,82,'{"S":2,"T":2,"I":2,"J":1}','{Analytical,Research,Practical}','{healthcare,science}','{Lab Methods,Accuracy}'),
('psychiatrist','Psychiatrist','Healthcare','Treat mental illness as a physician.',200000,350000,87,'{"F":1,"N":1,"I":1,"J":1}','{Analytical,Research}','{healthcare,psychology,science}','{Medicine,Psychotherapy}'),
('optometrist','Optometrist','Healthcare','Examine eyes and prescribe correction.',95000,160000,76,'{"S":2,"J":2,"T":1}','{Practical,Analytical}','{healthcare,science}','{Optics,Diagnosis}'),
('speech_therapist','Speech-Language Therapist','Healthcare','Help people communicate confidently.',55000,100000,83,'{"F":2,"S":1,"J":1}','{Practical,Research}','{healthcare,education,psychology}','{Speech Pathology,Patience}'),
('occupational_therapist','Occupational Therapist','Healthcare','Help patients regain daily-life skills.',60000,105000,84,'{"F":2,"S":1}','{Practical}','{healthcare,psychology}','{Rehabilitation,Creativity}'),
('midwife','Midwife','Healthcare','Support pregnancy and childbirth.',55000,110000,79,'{"F":2,"S":2,"J":1,"E":1}','{Practical}','{healthcare}','{Obstetrics,Empathy}'),
('radiologic_tech','Radiology Technician','Healthcare','Operate medical imaging equipment.',48000,85000,80,'{"S":2,"T":1,"J":2}','{Practical,Analytical}','{healthcare,technology}','{Imaging,Safety Protocols}'),

-- ---------- Science ----------
('geologist','Geologist','Science','Study Earth structures and resources.',60000,130000,74,'{"T":1,"S":1,"I":1}','{Research,Practical}','{science,environment}','{Field Work,Geology}'),
('astronomer','Astronomer','Science','Research stars, planets, and the universe.',70000,150000,65,'{"T":2,"N":2,"I":2}','{Research,Analytical,Innovative}','{science,technology}','{Astrophysics,Math}'),
('mathematician','Mathematician','Science','Develop mathematical theory and models.',70000,150000,72,'{"T":2,"N":2,"I":2,"P":1}','{Analytical,Research}','{science,technology}','{Proofs,Abstract Reasoning}'),
('statistician','Statistician','Science','Design studies and interpret data.',75000,150000,85,'{"T":2,"N":1,"J":1,"I":1}','{Analytical,Research}','{science,business,finance}','{Statistics,R/Python}'),
('marine_biologist','Marine Biologist','Science','Study ocean life and ecosystems.',50000,105000,68,'{"N":1,"I":1,"P":1}','{Research,Practical}','{science,environment}','{Biology,Field Research}'),
('meteorologist','Meteorologist','Science','Forecast weather and study climate.',55000,115000,72,'{"T":2,"N":1,"J":1}','{Analytical,Research}','{science,environment}','{Atmospheric Science,Modeling}'),
('geneticist','Geneticist','Science','Research genes and heredity.',70000,150000,81,'{"T":2,"N":2,"I":2}','{Research,Analytical}','{science,healthcare}','{Genomics,Lab Methods}'),
('neuroscientist','Neuroscientist','Science','Investigate the brain and nervous system.',70000,150000,79,'{"T":2,"N":2,"I":2}','{Research,Analytical,Innovative}','{science,psychology,healthcare}','{Neurobiology,Experiment Design}'),
('archaeologist','Archaeologist','Science','Uncover and interpret human history.',45000,95000,60,'{"N":1,"I":1,"P":1}','{Research,Practical}','{science,arts,education}','{Excavation,Analysis}'),
('food_scientist','Food Scientist','Science','Improve food safety and production.',55000,110000,76,'{"T":1,"S":2,"J":1}','{Research,Practical}','{science,healthcare,environment}','{Chemistry,Quality Control}'),

-- ---------- Business & Management ----------
('hr_manager','HR Manager','Business','Build teams and workplace culture.',65000,140000,82,'{"E":2,"F":2,"J":2}','{Strategic,Practical}','{business,psychology}','{Recruiting,Conflict Resolution}'),
('operations_manager','Operations Manager','Business','Run day-to-day business operations.',70000,150000,85,'{"E":1,"S":1,"T":1,"J":2}','{Strategic,Practical}','{business}','{Process Management,Leadership}'),
('project_manager','Project Manager','Business','Plan and deliver projects on time.',70000,150000,88,'{"E":1,"J":2,"T":1}','{Strategic,Practical}','{business,technology}','{Planning,Communication,Agile}'),
('supply_chain_manager','Supply Chain Manager','Business','Orchestrate global logistics and sourcing.',70000,150000,86,'{"T":2,"J":2,"S":1}','{Strategic,Analytical}','{business,finance}','{Logistics,Negotiation}'),
('sales_manager','Sales Manager','Business','Lead teams that win customers.',60000,180000,84,'{"E":2,"J":1,"T":1}','{Strategic,Practical}','{business,marketing}','{Persuasion,CRM}'),
('real_estate_agent','Real Estate Agent','Business','Match people with properties.',40000,150000,75,'{"E":2,"S":1,"P":1}','{Practical,Strategic}','{business,architecture}','{Negotiation,Networking}'),
('business_dev','Business Development Manager','Business','Open new markets and partnerships.',70000,160000,83,'{"E":2,"N":2,"T":1}','{Strategic}','{business,entrepreneurship}','{Partnerships,Pitching}'),
('economist','Economist','Business','Model markets and advise policy.',80000,170000,79,'{"T":2,"N":2,"I":1,"J":1}','{Analytical,Research,Strategic}','{finance,politics,business}','{Econometrics,Writing}'),

-- ---------- Finance ----------
('actuary','Actuary','Finance','Price risk with mathematics.',85000,190000,83,'{"T":2,"J":2,"I":2,"S":1}','{Analytical}','{finance,science}','{Probability,Modeling}'),
('auditor','Auditor','Finance','Verify financial records and controls.',60000,120000,80,'{"S":2,"T":2,"J":2,"I":1}','{Analytical,Practical}','{finance,business,law}','{Accounting Standards,Scrutiny}'),
('tax_advisor','Tax Advisor','Finance','Navigate tax law for clients.',60000,130000,77,'{"S":2,"T":2,"J":2}','{Analytical,Practical}','{finance,law}','{Tax Code,Advisory}'),
('insurance_underwriter','Insurance Underwriter','Finance','Assess and price insurance risk.',55000,115000,70,'{"S":2,"T":2,"J":2,"I":1}','{Analytical}','{finance,business}','{Risk Assessment}'),
('quant_analyst','Quantitative Analyst','Finance','Build trading and risk models.',110000,300000,84,'{"T":2,"N":2,"I":2}','{Analytical,Research}','{finance,technology,science}','{Math,Programming,Statistics}'),

-- ---------- Marketing & Media ----------
('digital_marketer','Digital Marketing Specialist','Marketing','Run online campaigns and growth loops.',45000,110000,88,'{"E":1,"N":2,"P":1}','{Innovative,Strategic}','{marketing,business,technology}','{SEO,Ads,Analytics}'),
('smm_manager','Social Media Manager','Marketing','Grow brands on social platforms.',40000,95000,85,'{"E":2,"N":2,"P":1,"F":1}','{Innovative}','{marketing,arts,journalism}','{Content,Community,Trends}'),
('pr_specialist','PR Specialist','Marketing','Shape public image and press relations.',50000,115000,76,'{"E":2,"N":1,"F":1,"J":1}','{Strategic,Innovative}','{marketing,journalism,politics}','{Media Relations,Writing}'),
('copywriter','Copywriter','Marketing','Write words that sell and persuade.',45000,110000,79,'{"N":2,"I":1,"P":1,"F":1}','{Innovative}','{marketing,arts,journalism}','{Writing,Persuasion}'),
('brand_manager','Brand Manager','Marketing','Own a brand''s identity and growth.',70000,150000,80,'{"E":1,"N":2,"J":1}','{Strategic,Innovative}','{marketing,business,design}','{Positioning,Campaigns}'),
('seo_specialist','SEO Specialist','Marketing','Win organic search visibility.',45000,105000,82,'{"T":1,"N":1,"I":2,"J":1}','{Analytical,Innovative}','{marketing,technology}','{Search Algorithms,Content Strategy}'),
('content_creator','Content Creator','Media','Build an audience with original content.',30000,200000,83,'{"E":1,"N":2,"P":2}','{Innovative}','{arts,marketing,journalism}','{Video,Storytelling,Consistency}'),
('video_editor','Video Editor','Media','Cut raw footage into stories.',40000,100000,81,'{"I":1,"N":1,"P":1}','{Innovative,Practical}','{arts,design,technology}','{Editing Software,Pacing}'),
('photographer','Photographer','Media','Capture moments and campaigns.',30000,110000,68,'{"I":1,"N":1,"P":2}','{Innovative,Practical}','{arts,design}','{Composition,Lighting}'),
('translator','Translator / Interpreter','Media','Bridge languages and cultures.',40000,95000,74,'{"I":2,"S":1,"J":1}','{Practical,Research}','{education,journalism,politics}','{Languages,Precision}'),
('tv_presenter','TV / Radio Presenter','Media','Host shows and engage audiences.',40000,150000,64,'{"E":2,"N":1,"F":1,"P":1}','{Innovative}','{journalism,arts,marketing}','{Public Speaking,Improvisation}'),
('editor_publisher','Editor','Media','Shape and publish written work.',50000,110000,70,'{"I":1,"N":1,"T":1,"J":2}','{Analytical,Innovative}','{journalism,arts,education}','{Editing,Judgment}'),

-- ---------- Design & Arts ----------
('interior_designer','Interior Designer','Design','Design functional, beautiful spaces.',45000,110000,74,'{"N":2,"F":1,"P":1}','{Innovative,Practical}','{design,architecture,arts}','{Space Planning,Materials}'),
('fashion_designer','Fashion Designer','Design','Create clothing and style lines.',40000,130000,66,'{"N":2,"F":1,"P":2}','{Innovative}','{design,arts,entrepreneurship}','{Sketching,Textiles}'),
('industrial_designer','Industrial Designer','Design','Design physical products people use.',55000,120000,75,'{"N":2,"T":1}','{Innovative,Practical}','{design,engineering,arts}','{Prototyping,CAD}'),
('animator','Animator','Design','Bring characters and stories to motion.',45000,110000,73,'{"N":2,"I":1,"P":2}','{Innovative}','{arts,design,technology}','{Animation Software,Timing}'),
('illustrator','Illustrator','Design','Draw art for books, brands, and games.',35000,95000,67,'{"N":2,"I":2,"F":1,"P":2}','{Innovative}','{arts,design}','{Drawing,Style}'),
('game_designer','Game Designer','Design','Design rules, worlds, and player experiences.',55000,130000,77,'{"N":2,"T":1,"P":1}','{Innovative,Strategic}','{design,technology,arts}','{Systems Design,Playtesting}'),
('art_director','Art Director','Design','Lead the visual direction of projects.',70000,150000,72,'{"N":2,"E":1,"J":1}','{Innovative,Strategic}','{design,arts,marketing}','{Visual Leadership,Concepting}'),
('actor','Actor','Arts','Perform on stage and screen.',25000,200000,58,'{"E":2,"N":1,"F":2,"P":1}','{Innovative}','{arts}','{Performance,Emotional Range}'),
('dancer','Dancer / Choreographer','Arts','Express stories through movement.',25000,90000,56,'{"E":1,"S":1,"F":1,"P":2}','{Practical,Innovative}','{arts,sports}','{Technique,Discipline}'),
('chef','Chef','Hospitality','Create dishes and lead kitchens.',35000,120000,80,'{"S":2,"P":1,"E":1,"T":1}','{Practical,Innovative}','{arts,entrepreneurship}','{Culinary Technique,Speed}'),
('pastry_chef','Pastry Chef / Baker','Hospitality','Craft breads, desserts, and confections.',30000,85000,72,'{"S":2,"I":1,"J":1,"F":1}','{Practical,Innovative}','{arts}','{Baking Science,Precision}'),

-- ---------- Education & Social ----------
('school_counselor','School Counselor','Education','Guide students through school and life.',50000,90000,83,'{"F":2,"E":1,"J":1,"N":1}','{Practical,Research}','{education,psychology}','{Listening,Guidance}'),
('special_ed_teacher','Special Education Teacher','Education','Teach students with diverse needs.',45000,85000,85,'{"F":2,"S":1,"J":1}','{Practical}','{education,psychology,healthcare}','{Adaptability,Patience}'),
('kindergarten_teacher','Early Childhood Educator','Education','Nurture the youngest learners.',35000,70000,84,'{"F":2,"E":2,"S":1,"P":1}','{Practical}','{education,psychology}','{Play-Based Learning,Warmth}'),
('librarian','Librarian / Information Specialist','Education','Curate knowledge and help research.',45000,85000,62,'{"I":2,"S":1,"J":2,"F":1}','{Research,Practical}','{education,arts}','{Cataloguing,Research Help}'),
('social_worker','Social Worker','Social Impact','Support families and communities in need.',45000,80000,86,'{"F":2,"E":1,"J":1,"N":1}','{Practical,Research}','{psychology,education,healthcare}','{Case Management,Advocacy}'),
('linguist','Linguist','Social Sciences','Study language structure and use.',55000,115000,66,'{"I":2,"N":2,"T":1}','{Research,Analytical}','{education,science,journalism}','{Phonetics,Analysis}'),
('historian','Historian','Social Sciences','Research and interpret the past.',50000,105000,60,'{"I":2,"N":2,"T":1,"J":1}','{Research,Analytical}','{education,politics,arts}','{Archival Research,Writing}'),
('sociologist','Sociologist','Social Sciences','Study societies and social behavior.',55000,115000,65,'{"N":2,"T":1,"I":1}','{Research,Analytical}','{psychology,politics,education}','{Survey Methods,Theory}'),

-- ---------- Law, Government & Public Safety ----------
('prosecutor','Prosecutor','Law','Represent the state in court.',70000,180000,74,'{"T":2,"E":1,"J":2}','{Analytical,Strategic}','{law,politics}','{Litigation,Ethics}'),
('notary','Notary / Legal Consultant','Law','Certify documents and advise on legal form.',50000,120000,68,'{"S":2,"T":1,"J":2,"I":1}','{Practical,Analytical}','{law,business}','{Legal Documents,Accuracy}'),
('detective','Detective / Investigator','Public Safety','Solve crimes through evidence and inference.',50000,110000,75,'{"T":2,"S":1,"I":1}','{Analytical,Research,Practical}','{law,psychology}','{Investigation,Interviewing}'),
('police_officer','Police Officer','Public Safety','Protect communities and enforce law.',40000,90000,78,'{"S":2,"E":1,"J":2,"T":1}','{Practical}','{law,sports}','{Physical Readiness,Judgment}'),
('firefighter','Firefighter','Public Safety','Respond to fires and emergencies.',40000,85000,77,'{"S":2,"E":1,"P":1,"F":1}','{Practical}','{sports,healthcare}','{Courage,Teamwork}'),
('military_officer','Military Officer','Public Safety','Lead units and plan operations.',45000,120000,72,'{"E":1,"S":1,"T":1,"J":2}','{Strategic,Practical}','{politics,sports,law}','{Leadership,Discipline}'),
('urban_planner','Urban Planner','Government','Design how cities grow and function.',60000,120000,79,'{"N":2,"T":1,"J":2}','{Strategic,Analytical,Practical}','{architecture,politics,environment}','{Zoning,GIS}'),
('public_administrator','Public Administrator','Government','Run public institutions and services.',55000,130000,73,'{"E":1,"S":1,"T":1,"J":2}','{Strategic,Practical}','{politics,law,business}','{Governance,Budgeting}'),
('ngo_manager','NGO Program Manager','Social Impact','Lead nonprofit programs that create change.',45000,100000,75,'{"E":1,"N":1,"F":2,"J":1}','{Strategic,Practical}','{politics,education,environment}','{Fundraising,Program Design}'),

-- ---------- Trades & Construction ----------
('electrician','Electrician','Trades','Install and repair electrical systems.',45000,95000,88,'{"S":2,"T":1,"P":1,"I":1}','{Practical}','{engineering,technology}','{Wiring,Safety Codes}'),
('plumber','Plumber','Trades','Install and fix water and gas systems.',45000,90000,85,'{"S":2,"T":1,"P":1}','{Practical}','{engineering}','{Pipefitting,Problem Solving}'),
('carpenter','Carpenter','Trades','Build with wood, from frames to furniture.',40000,85000,80,'{"S":2,"P":1,"I":1,"T":1}','{Practical}','{engineering,design,arts}','{Woodwork,Measurement}'),
('welder','Welder','Trades','Join metal for construction and industry.',40000,90000,82,'{"S":2,"T":1,"I":1,"P":1}','{Practical}','{engineering}','{Welding Techniques,Steady Hands}'),
('auto_mechanic','Auto Mechanic','Trades','Diagnose and repair vehicles.',38000,85000,83,'{"S":2,"T":2,"P":1,"I":1}','{Practical,Analytical}','{engineering,technology}','{Diagnostics,Repair}'),
('hvac_technician','HVAC Technician','Trades','Install heating and cooling systems.',42000,85000,84,'{"S":2,"T":1,"J":1}','{Practical}','{engineering,environment}','{Refrigeration,Systems}'),
('construction_manager','Construction Manager','Trades','Run building sites from plan to handover.',70000,150000,84,'{"E":1,"S":2,"T":1,"J":2}','{Practical,Strategic}','{engineering,architecture,business}','{Scheduling,Site Safety}'),
('surveyor','Land Surveyor','Trades','Measure land for construction and law.',50000,100000,74,'{"S":2,"T":2,"J":2,"I":1}','{Practical,Analytical}','{engineering,architecture,environment}','{Geomatics,Precision Instruments}'),

-- ---------- Aviation, Transport & Logistics ----------
('pilot','Airline Pilot','Aviation','Fly passengers and cargo safely.',90000,300000,82,'{"S":2,"T":2,"J":2,"I":1}','{Practical,Analytical}','{engineering,technology,sports}','{Flight Operations,Decision Making}'),
('air_traffic_controller','Air Traffic Controller','Aviation','Direct aircraft through busy skies.',75000,180000,78,'{"S":2,"T":2,"J":2,"I":1}','{Analytical,Practical}','{technology,engineering}','{Spatial Reasoning,Composure}'),
('flight_attendant','Flight Attendant','Aviation','Keep passengers safe and comfortable.',35000,80000,74,'{"E":2,"S":1,"F":2,"P":1}','{Practical}','{sports,psychology,business}','{Service,Safety Procedures}'),
('maritime_officer','Maritime Officer','Transport','Navigate ships across the world.',55000,140000,68,'{"S":2,"T":1,"J":2,"I":1}','{Practical,Strategic}','{engineering,environment}','{Navigation,Leadership}'),
('logistics_coordinator','Logistics Coordinator','Transport','Keep goods moving on schedule.',45000,95000,84,'{"S":2,"T":1,"J":2,"E":1}','{Practical,Strategic}','{business,finance}','{Coordination,ERP Systems}'),

-- ---------- Agriculture & Environment ----------
('agronomist','Agronomist','Agriculture','Improve crops, soil, and yields.',45000,95000,80,'{"S":2,"T":1,"I":1}','{Practical,Research}','{environment,science,engineering}','{Soil Science,Crop Management}'),
('agribusiness_manager','Agribusiness Manager','Agriculture','Run modern farming enterprises.',50000,120000,78,'{"E":1,"S":2,"T":1,"J":2}','{Strategic,Practical}','{business,environment,entrepreneurship}','{Farm Economics,Operations}'),
('forester','Forester / Conservationist','Agriculture','Manage forests and protected lands.',45000,90000,72,'{"S":1,"I":2,"J":1}','{Practical,Research}','{environment,science}','{Ecology,Land Management}'),
('landscape_architect','Landscape Architect','Architecture','Design parks, gardens, and outdoor spaces.',55000,115000,72,'{"N":2,"F":1,"J":1}','{Innovative,Practical}','{architecture,design,environment}','{Planting Design,Site Planning}'),

-- ---------- Hospitality, Tourism & Events ----------
('hotel_manager','Hotel Manager','Hospitality','Run hotels and guest experiences.',50000,120000,77,'{"E":2,"S":1,"F":1,"J":2}','{Practical,Strategic}','{business,marketing}','{Service Excellence,Operations}'),
('event_planner','Event Planner','Hospitality','Produce memorable events end-to-end.',40000,95000,76,'{"E":2,"S":1,"J":2,"F":1}','{Practical,Strategic}','{business,marketing,arts}','{Logistics,Vendor Management}'),
('tour_guide','Tour Guide / Travel Specialist','Hospitality','Show travelers the world.',30000,70000,70,'{"E":2,"S":1,"F":1,"P":2}','{Practical}','{education,arts,environment}','{Storytelling,Languages}'),
('restaurant_manager','Restaurant Manager','Hospitality','Lead dining operations and teams.',45000,95000,78,'{"E":2,"S":2,"J":2}','{Practical,Strategic}','{business,entrepreneurship}','{Team Leadership,Cost Control}'),

-- ---------- Sports & Wellness ----------
('personal_trainer','Personal Trainer','Sports','Coach individuals to fitness goals.',30000,90000,79,'{"E":2,"S":2,"F":1,"P":1}','{Practical}','{sports,healthcare}','{Exercise Science,Motivation}'),
('sports_analyst','Sports Analyst','Sports','Turn game data into winning insights.',50000,120000,72,'{"T":2,"N":1,"I":1,"J":1}','{Analytical,Research}','{sports,technology,journalism}','{Statistics,Video Analysis}'),
('physiotherapist_sport','Sports Physiotherapist','Sports','Rehabilitate athletes after injury.',55000,110000,80,'{"S":2,"F":1,"E":1}','{Practical,Analytical}','{sports,healthcare}','{Injury Rehab,Biomechanics}'),
('esports_professional','Esports Professional','Sports','Compete and build a brand in gaming.',25000,200000,64,'{"I":1,"T":1,"P":2,"N":1}','{Strategic,Practical}','{sports,technology,arts}','{Reflexes,Streaming}'),

-- ---------- Entrepreneurship ----------
('startup_product_designer','Startup Product Designer','Entrepreneurship','Design and ship products at speed.',60000,150000,80,'{"N":2,"P":1,"E":1,"T":1}','{Innovative,Strategic}','{entrepreneurship,design,technology}','{Rapid Prototyping,User Research}'),
('ecommerce_founder','E-commerce Entrepreneur','Entrepreneurship','Build and scale online stores.',0,500000,81,'{"E":1,"N":2,"P":1,"T":1}','{Strategic,Innovative}','{entrepreneurship,business,marketing}','{Digital Sales,Supply Chain}'),
('franchise_owner','Franchise Owner','Entrepreneurship','Operate proven business models.',40000,250000,74,'{"E":1,"S":2,"J":2}','{Practical,Strategic}','{entrepreneurship,business}','{Operations,People Management}'),
('social_entrepreneur','Social Entrepreneur','Entrepreneurship','Build ventures that solve social problems.',30000,150000,73,'{"E":1,"N":2,"F":2,"P":1}','{Innovative,Strategic}','{entrepreneurship,politics,environment}','{Impact Models,Fundraising}')

ON CONFLICT (key) DO NOTHING;
