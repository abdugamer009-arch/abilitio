// Question Bank — master pool for all assessment questions.
// Expandable: add more questions to each array; the session picker selects 10 from each.

import type { PersonalityQ, CognitiveQ, InterestQ } from "./career-assessment";

// ─────────────────────────────────────────────────────────────────────────────
// PERSONALITY BANK  (target: 200 questions)
// Currently: 40 questions (10 per MBTI axis × 4 axes)
// ─────────────────────────────────────────────────────────────────────────────
export const PERSONALITY_BANK: PersonalityQ[] = [
  // ── E/I ──
  { id: "p1",  section: "personality", prompt: "You feel energized after spending time with a large group of people.", axis: "EI", direction: 1 },
  { id: "p2",  section: "personality", prompt: "You prefer quiet, focused work over collaborative brainstorms.", axis: "EI", direction: -1 },
  { id: "p3",  section: "personality", prompt: "You enjoy meeting new people at events.", axis: "EI", direction: 1 },
  { id: "p4",  section: "personality", prompt: "You need solo time to recharge after busy days.", axis: "EI", direction: -1 },
  { id: "p5",  section: "personality", prompt: "You find it easy to strike up conversations with strangers.", axis: "EI", direction: 1 },
  { id: "p6",  section: "personality", prompt: "You often feel drained after long social events.", axis: "EI", direction: -1 },
  { id: "p7",  section: "personality", prompt: "You enjoy being the center of attention in social settings.", axis: "EI", direction: 1 },
  { id: "p8",  section: "personality", prompt: "You prefer one-on-one conversations over group discussions.", axis: "EI", direction: -1 },
  { id: "p9",  section: "personality", prompt: "You get excited about attending parties or gatherings.", axis: "EI", direction: 1 },
  { id: "p10", section: "personality", prompt: "You need time alone after a busy day to restore your energy.", axis: "EI", direction: -1 },
  // ── S/N ──
  { id: "p11", section: "personality", prompt: "You focus on concrete facts more than abstract ideas.", axis: "SN", direction: 1 },
  { id: "p12", section: "personality", prompt: "You enjoy thinking about future possibilities and big-picture ideas.", axis: "SN", direction: -1 },
  { id: "p13", section: "personality", prompt: "You trust hands-on experience over theoretical models.", axis: "SN", direction: 1 },
  { id: "p14", section: "personality", prompt: "You often see patterns and meanings others miss.", axis: "SN", direction: -1 },
  { id: "p15", section: "personality", prompt: "You prefer step-by-step instructions rather than vague guidelines.", axis: "SN", direction: 1 },
  { id: "p16", section: "personality", prompt: "You are drawn to big ideas and theories even if they seem impractical.", axis: "SN", direction: -1 },
  { id: "p17", section: "personality", prompt: "You prefer to live in the present rather than plan for a distant future.", axis: "SN", direction: 1 },
  { id: "p18", section: "personality", prompt: "You often wonder about deeper meanings and connections between things.", axis: "SN", direction: -1 },
  { id: "p19", section: "personality", prompt: "You trust your direct experience more than intuition or hunches.", axis: "SN", direction: 1 },
  { id: "p20", section: "personality", prompt: "You enjoy exploring abstract concepts and hypothetical scenarios.", axis: "SN", direction: -1 },
  // ── T/F ──
  { id: "p21", section: "personality", prompt: "You make decisions based on logic and analysis rather than feelings.", axis: "TF", direction: 1 },
  { id: "p22", section: "personality", prompt: "You weigh how your decisions affect people's emotions heavily.", axis: "TF", direction: -1 },
  { id: "p23", section: "personality", prompt: "You value fairness and objective rules over harmony.", axis: "TF", direction: 1 },
  { id: "p24", section: "personality", prompt: "You prioritize empathy when giving advice.", axis: "TF", direction: -1 },
  { id: "p25", section: "personality", prompt: "When critiquing someone's work, you focus on facts, not feelings.", axis: "TF", direction: 1 },
  { id: "p26", section: "personality", prompt: "You feel uncomfortable delivering criticism even when it's necessary.", axis: "TF", direction: -1 },
  { id: "p27", section: "personality", prompt: "You believe truth is more important than tact.", axis: "TF", direction: 1 },
  { id: "p28", section: "personality", prompt: "You find it natural to put yourself in others' shoes.", axis: "TF", direction: -1 },
  { id: "p29", section: "personality", prompt: "You prefer to settle disputes with objective data rather than compromise.", axis: "TF", direction: 1 },
  { id: "p30", section: "personality", prompt: "You are moved by stories of hardship and injustice more than statistics.", axis: "TF", direction: -1 },
  // ── J/P ──
  { id: "p31", section: "personality", prompt: "You prefer detailed plans and schedules over improvisation.", axis: "JP", direction: 1 },
  { id: "p32", section: "personality", prompt: "You enjoy keeping options open until the last minute.", axis: "JP", direction: -1 },
  { id: "p33", section: "personality", prompt: "You feel uncomfortable when tasks are left unfinished.", axis: "JP", direction: 1 },
  { id: "p34", section: "personality", prompt: "You adapt quickly to unexpected changes in plans.", axis: "JP", direction: -1 },
  { id: "p35", section: "personality", prompt: "You like having a clear agenda before starting a project.", axis: "JP", direction: 1 },
  { id: "p36", section: "personality", prompt: "You prefer to explore options rather than commit to a single plan.", axis: "JP", direction: -1 },
  { id: "p37", section: "personality", prompt: "You set deadlines for yourself even when none are required.", axis: "JP", direction: 1 },
  { id: "p38", section: "personality", prompt: "You find rigid schedules constraining and prefer to go with the flow.", axis: "JP", direction: -1 },
  { id: "p39", section: "personality", prompt: "You feel satisfied when you finish your to-do list ahead of schedule.", axis: "JP", direction: 1 },
  { id: "p40", section: "personality", prompt: "You tend to start multiple projects at once and shift between them freely.", axis: "JP", direction: -1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// IQ / COGNITIVE BANK  (target: 200 questions)
// Currently: 50 questions (10 original cognitive + 40 from Carter's IQ test)
// ─────────────────────────────────────────────────────────────────────────────
export const IQ_BANK: CognitiveQ[] = [
  // ── Original cognitive questions ──
  { id: "c1",  section: "cognitive", prompt: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["36","40","42","44"], correct: 2 },
  { id: "c2",  section: "cognitive", prompt: "All roses are flowers. Some flowers fade quickly. Therefore:", options: ["All roses fade quickly","Some roses may fade quickly","No roses fade","Only roses fade"], correct: 1 },
  { id: "c3",  section: "cognitive", prompt: "If CAT = 3120 and DOG = 4157, what code is BIRD?", options: ["29184","21845","29154","29185"], correct: 3 },
  { id: "c4",  section: "cognitive", prompt: "Which one doesn't belong: Square, Circle, Triangle, Cube?", options: ["Square","Circle","Triangle","Cube"], correct: 3 },
  { id: "c5",  section: "cognitive", prompt: "If 5 machines make 5 widgets in 5 minutes, how long do 100 machines need for 100 widgets?", options: ["100 min","20 min","5 min","1 min"], correct: 2 },
  { id: "c6",  section: "cognitive", prompt: "Pattern: A, C, F, J, O, ?", options: ["S","T","U","V"], correct: 2 },
  { id: "c7",  section: "cognitive", prompt: "A train leaves at 60 mph. Another follows 2 hours later at 80 mph. When does it catch up?", options: ["6 h after the first","8 h after the first","10 h after the first","12 h after the first"], correct: 0 },
  { id: "c8",  section: "cognitive", prompt: "Which number completes the series: 1, 4, 9, 16, 25, ?", options: ["30","32","36","49"], correct: 2 },
  { id: "c9",  section: "cognitive", prompt: "If some A are B and all B are C, then:", options: ["All A are C","Some A are C","No A are C","All C are A"], correct: 1 },
  { id: "c10", section: "cognitive", prompt: "What comes next: 81, 27, 9, 3, ?", options: ["0","1","1.5","2"], correct: 1 },
  // ── IQ test questions (Carter, 2005) ──
  { id: "iq1",  section: "cognitive", prompt: "A white dot starts at the bottom-left corner and moves two places anti-clockwise at each stage. A black dot starts at the top-right corner and moves one place clockwise. After how many stages will both dots be in the same corner?", options: ["2 stages","4 stages","6 stages","8 stages"], correct: 1 },
  { id: "iq2",  section: "cognitive", prompt: "72496 → 1315 | 62134 → 97 | 85316 → 167 | 28439 → ?", options: ["1412","5823","741","2819"], correct: 0 },
  { id: "iq3",  section: "cognitive", prompt: "Which group of letters is the odd one out?\nCEFH  HJKN  LNOQ  PRSV  UWXZ  DFGI", options: ["CEFH","HJKN","PRSV","DFGI"], correct: 1 },
  { id: "iq4",  section: "cognitive", prompt: "Which two words are most OPPOSITE in meaning?\nimaginary, realistic, illegible, impracticable, radical, embellished", options: ["imaginary / radical","realistic / impracticable","illegible / embellished","radical / embellished"], correct: 1 },
  { id: "iq5",  section: "cognitive", prompt: "Associate is to colleague as accomplice is to:", options: ["consort","friend","accessory","comrade"], correct: 2 },
  { id: "iq6",  section: "cognitive", prompt: "Which is the odd one out?\nfamous, illustrious, acclaimed, fabulous, noteworthy", options: ["famous","illustrious","fabulous","noteworthy"], correct: 2 },
  { id: "iq7",  section: "cognitive", prompt: "What two numbers replace the question marks?\n100, 95, ?, 79, 68, ?, 40, 23", options: ["88 and 55","85 and 52","86 and 54","90 and 57"], correct: 0 },
  { id: "iq8",  section: "cognitive", prompt: "GAINED VOTE is an anagram of which two words that are similar in meaning?", options: ["DEVOTED / GAIN","DONATE / GIVE","AVID / TONE","VOTED / AGAIN"], correct: 1 },
  { id: "iq9",  section: "cognitive", prompt: "Which word in brackets is most OPPOSITE in meaning to MITIGATE?\n(augment, palliate, appreciate, trust, destroy)", options: ["augment","palliate","appreciate","destroy"], correct: 0 },
  { id: "iq10", section: "cognitive", prompt: "Which two words are closest in meaning?\neducated, clear, literal, enervated, wordy, verbatim", options: ["educated / clear","literal / verbatim","wordy / educated","clear / verbatim"], correct: 1 },
  { id: "iq11", section: "cognitive", prompt: "What number should replace the question mark?\n19  9  17\n23 12  25\n13  ?  31", options: ["9","11","13","15"], correct: 1 },
  { id: "iq12", section: "cognitive", prompt: "What letter is three to the right of the letter immediately to the left of the letter four to the left of G?\n(Alphabet: A B C D E F G H I …)", options: ["C","D","E","F"], correct: 2 },
  { id: "iq13", section: "cognitive", prompt: "Which word in brackets is closest in meaning to HABITUATED?\n(constant, accustomed, colonized, commonplace, energetic)", options: ["constant","accustomed","colonized","commonplace"], correct: 1 },
  { id: "iq14", section: "cognitive", prompt: "A barrel holds 85 litres when full. How many litres remain after 40% has been used?", options: ["34 litres","45 litres","51 litres","55 litres"], correct: 2 },
  { id: "iq15", section: "cognitive", prompt: "DECISIVE LARK is an anagram of which two words that are OPPOSITE in meaning?", options: ["CRAVE / DISLIKE","LACKED / REVISE","DERIVED / LACKS","CLEARS / DIVIDE"], correct: 0 },
  { id: "iq16", section: "cognitive", prompt: "What number replaces the question mark?\n0, 19, 38, 57, ?, 95", options: ["66","72","76","80"], correct: 2 },
  { id: "iq17", section: "cognitive", prompt: "What number replaces the question mark?\n10, 21, 33, 46, 60, 75, ?", options: ["88","90","91","93"], correct: 2 },
  { id: "iq18", section: "cognitive", prompt: "Joe has 1.5× as many as Mo. Mo has 1.5× as many as Flo. Altogether they have 76. How many does Joe have?", options: ["24","30","36","40"], correct: 2 },
  { id: "iq19", section: "cognitive", prompt: "Which sentence is grammatically correct?", options: ["The Gardener's Association debated whether to hold it's bi-annual flower show.", "The Gardeners' Association debated whether to hold its bi-annual flower show at the beginning and end of April and September each year.", "The Gardeners' Association debated whether to hold it's bi-annual flower show.", "The Gardeners' Association debated whether to hold its biennial flower show."], correct: 1 },
  { id: "iq20", section: "cognitive", prompt: "What number replaces the question mark in this grid?\n1  3   7  13\n4  6  10  16\n9  11 15  21\n16 18  22  ?", options: ["24","26","28","30"], correct: 2 },
  { id: "iq21", section: "cognitive", prompt: "Switch A toggles lights 1 and 2. Switch B toggles lights 2 and 4. Switch C toggles lights 1 and 3. Switches A, C, B are thrown. Start: 1●,2○,3●,4○ → Result: 1●,2●,3○,4○. Which switch is faulty?", options: ["Switch A","Switch B","Switch C","None"], correct: 2 },
  { id: "iq22", section: "cognitive", prompt: "Three overlapping circles. Left: 3.5, 5, 1.5, 4.5. Centre: 7.5, 11, 3.5, ?. Right: 2, 8.5, 3. Rule: left + right = centre. What replaces the question mark?", options: ["5.5","6.5","7.5","8.0"], correct: 1 },
  { id: "iq23", section: "cognitive", prompt: "What number replaces the question mark?\n49  615  62\n85  177  29\n53   ?   74", options: ["910","127","821","635"], correct: 0 },
  { id: "iq24", section: "cognitive", prompt: "A barrel contains 85 litres. After using 40%, how many litres remain?", options: ["34","45","51","55"], correct: 2 },
  { id: "iq25", section: "cognitive", prompt: "Which word is the odd one out?\nArthropod, Artificer, Arteriole, Artichoke — which comes LAST alphabetically?", options: ["Arthropod","Artificer","Arteriole","Artichoke"], correct: 1 },
  { id: "iq26", section: "cognitive", prompt: "Identify two words (one from each bracket) that form a connection with the word in capitals.\nRESTRAIN (suppress / deny / conceal) | WITHHOLD (curb / reserve / conceal)", options: ["deny / curb","suppress / reserve","conceal / conceal","suppress / curb"], correct: 1 },
  { id: "iq27", section: "cognitive", prompt: "ENCYCLOPEDIA: Which adjacent-letter path (horizontal and vertical only) can spell this word in a letter grid?", options: ["Yes, it can be spelled","No, it cannot","Only diagonally","Only backwards"], correct: 0 },
  { id: "iq28", section: "cognitive", prompt: "Start at a corner and spiral clockwise round the perimeter to spell a 9-letter word: N A R N C O T _", options: ["NOCTURNAL","NARCOTICS","CANONICAL","NOTORIOUS"], correct: 0 },
  { id: "iq29", section: "cognitive", prompt: "Numbers in the outer circle = difference of adjacent inner numbers (anti-clockwise). Given: 9−4=5, 7−5=2, 8−1=7. What replaces the question mark?", options: ["3","4","5","6"], correct: 2 },
  { id: "iq30", section: "cognitive", prompt: "What number replaces the question mark?\n72496 → 1315 | 62134 → 97 | Rule: pair and sum the digits", options: ["1412","5823","741","2819"], correct: 0 },
  // ── Additional IQ questions (logic, verbal, numerical) ──
  { id: "iq31", section: "cognitive", prompt: "If FEBRUARY has 28 days in a common year, how many months have 30 days?", options: ["2","3","4","5"], correct: 2 },
  { id: "iq32", section: "cognitive", prompt: "A is taller than B. C is shorter than A. D is taller than C. Who might be the tallest?", options: ["A","B","C","D"], correct: 0 },
  { id: "iq33", section: "cognitive", prompt: "What number comes next: 3, 6, 11, 18, 27, ?", options: ["36","38","39","40"], correct: 1 },
  { id: "iq34", section: "cognitive", prompt: "Mary is twice as old as Ann was when Mary was as old as Ann is now. Mary is 24. How old is Ann?", options: ["16","18","20","22"], correct: 0 },
  { id: "iq35", section: "cognitive", prompt: "Which word does NOT belong: Hammer, Chisel, Wrench, Screwdriver, Paintbrush, Saw?", options: ["Hammer","Paintbrush","Chisel","Wrench"], correct: 1 },
  { id: "iq36", section: "cognitive", prompt: "Find the next letter pair: AB, CE, FI, JN, ?", options: ["OS","OT","PS","PT"], correct: 0 },
  { id: "iq37", section: "cognitive", prompt: "If you rearrange the letters CIFAIPC, you get the name of:", options: ["A city","An ocean","A country","A mountain"], correct: 1 },
  { id: "iq38", section: "cognitive", prompt: "How many squares are in a 4×4 grid (including overlapping squares)?", options: ["16","20","30","36"], correct: 2 },
  { id: "iq39", section: "cognitive", prompt: "Which is heavier: a kilogram of feathers or a kilogram of iron?", options: ["Iron","Feathers","They weigh the same","Depends on humidity"], correct: 2 },
  { id: "iq40", section: "cognitive", prompt: "Complete the analogy: Book is to Library as Painting is to:", options: ["Canvas","Museum","Artist","Frame"], correct: 1 },
  { id: "iq41", section: "cognitive", prompt: "What number should replace the question mark? 2, 3, 5, 8, 13, 21, ?", options: ["30","34","36","40"], correct: 1 },
  { id: "iq42", section: "cognitive", prompt: "A snail climbs 3 m up a wall during the day and slides 1 m back at night. How many days to climb 10 m?", options: ["4","5","6","7"], correct: 1 },
  { id: "iq43", section: "cognitive", prompt: "If all Bloops are Razzles, and all Razzles are Lazzles, then all Bloops are definitely:", options: ["Razzles","Lazzles","Neither","Both"], correct: 3 },
  { id: "iq44", section: "cognitive", prompt: "Which number is missing? 5, 10, 20, ?, 80, 160", options: ["35","40","45","50"], correct: 1 },
  { id: "iq45", section: "cognitive", prompt: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°","7.5°","15°","22.5°"], correct: 1 },
  { id: "iq46", section: "cognitive", prompt: "If you count from 1 to 100, how many times does the digit 9 appear?", options: ["9","10","19","20"], correct: 3 },
  { id: "iq47", section: "cognitive", prompt: "Which word is the odd one out: Violin, Guitar, Trumpet, Cello, Harp?", options: ["Violin","Trumpet","Cello","Harp"], correct: 1 },
  { id: "iq48", section: "cognitive", prompt: "Tom is 4 years older than Jerry. In 6 years, Tom will be twice Jerry's current age. How old is Tom now?", options: ["10","12","14","16"], correct: 0 },
  { id: "iq49", section: "cognitive", prompt: "What comes next: 1, 8, 27, 64, 125, ?", options: ["196","216","225","256"], correct: 1 },
  { id: "iq50", section: "cognitive", prompt: "If South is East and East is North, then which direction is West?", options: ["North","South","East","Northwest"], correct: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTEREST BANK  (target: 200 questions)
// Currently: 20 questions, each a themed multi-select interest probe
// ─────────────────────────────────────────────────────────────────────────────
export const INTEREST_BANK: InterestQ[] = [
  { id: "i1",  section: "interest", prompt: "Which fields excite you the most? (select all that apply)", multi: true, options: [{ label: "Technology", key: "technology" }, { label: "Engineering", key: "engineering" }, { label: "Science", key: "science" }, { label: "Healthcare", key: "healthcare" }, { label: "Business", key: "business" }, { label: "Finance", key: "finance" }] },
  { id: "i2",  section: "interest", prompt: "Which creative directions appeal to you?", multi: true, options: [{ label: "Design", key: "design" }, { label: "Arts", key: "arts" }, { label: "Journalism", key: "journalism" }, { label: "Marketing", key: "marketing" }, { label: "Architecture", key: "architecture" }, { label: "Entrepreneurship", key: "entrepreneurship" }] },
  { id: "i3",  section: "interest", prompt: "Which social-impact areas matter to you?", multi: true, options: [{ label: "Education", key: "education" }, { label: "Psychology", key: "psychology" }, { label: "Law", key: "law" }, { label: "Politics", key: "politics" }, { label: "Environment", key: "environment" }, { label: "Healthcare", key: "healthcare" }] },
  { id: "i4",  section: "interest", prompt: "Which lifestyle or performance areas attract you?", multi: true, options: [{ label: "Sports", key: "sports" }, { label: "Entrepreneurship", key: "entrepreneurship" }, { label: "Arts", key: "arts" }, { label: "Technology", key: "technology" }, { label: "Business", key: "business" }, { label: "Design", key: "design" }] },
  { id: "i5",  section: "interest", prompt: "Imagine your ideal workplace. Which environment fits best?", multi: true, options: [{ label: "Tech startup", key: "technology" }, { label: "Hospital or clinic", key: "healthcare" }, { label: "Law firm", key: "law" }, { label: "Creative studio", key: "design" }, { label: "Research lab", key: "science" }, { label: "Financial institution", key: "finance" }] },
  { id: "i6",  section: "interest", prompt: "Which topics do you enjoy reading about in your free time?", multi: true, options: [{ label: "Science & discovery", key: "science" }, { label: "Business & economics", key: "business" }, { label: "History & politics", key: "politics" }, { label: "Art & culture", key: "arts" }, { label: "Technology trends", key: "technology" }, { label: "Psychology & behavior", key: "psychology" }] },
  { id: "i7",  section: "interest", prompt: "Which problems would you most like to help solve?", multi: true, options: [{ label: "Climate change", key: "environment" }, { label: "Access to education", key: "education" }, { label: "Economic inequality", key: "finance" }, { label: "Disease & health crises", key: "healthcare" }, { label: "Digital privacy", key: "technology" }, { label: "Social justice", key: "law" }] },
  { id: "i8",  section: "interest", prompt: "Which skills would you most like to develop professionally?", multi: true, options: [{ label: "Coding & software", key: "technology" }, { label: "Leadership & management", key: "business" }, { label: "Public speaking", key: "journalism" }, { label: "Medical expertise", key: "healthcare" }, { label: "Creative production", key: "arts" }, { label: "Scientific research", key: "science" }] },
  { id: "i9",  section: "interest", prompt: "Which university subjects sound most appealing?", multi: true, options: [{ label: "Computer Science", key: "technology" }, { label: "Architecture", key: "architecture" }, { label: "Medicine", key: "healthcare" }, { label: "Political Science", key: "politics" }, { label: "Finance & Economics", key: "finance" }, { label: "Fine Arts", key: "arts" }] },
  { id: "i10", section: "interest", prompt: "Which type of projects motivates you most?", multi: true, options: [{ label: "Building products", key: "engineering" }, { label: "Helping communities", key: "education" }, { label: "Creating campaigns", key: "marketing" }, { label: "Analyzing data", key: "science" }, { label: "Writing & publishing", key: "journalism" }, { label: "Designing spaces", key: "architecture" }] },
  { id: "i11", section: "interest", prompt: "Which activities do you find yourself doing voluntarily?", multi: true, options: [{ label: "Tinkering with gadgets", key: "engineering" }, { label: "Coaching or mentoring", key: "education" }, { label: "Starting small ventures", key: "entrepreneurship" }, { label: "Drawing or painting", key: "arts" }, { label: "Playing or watching sports", key: "sports" }, { label: "Debating current events", key: "politics" }] },
  { id: "i12", section: "interest", prompt: "Which industries do you follow most on social media?", multi: true, options: [{ label: "Tech & innovation", key: "technology" }, { label: "Sports & fitness", key: "sports" }, { label: "Fashion & design", key: "design" }, { label: "Finance & investing", key: "finance" }, { label: "Health & wellness", key: "healthcare" }, { label: "Environment & sustainability", key: "environment" }] },
  { id: "i13", section: "interest", prompt: "What kind of impact do you want your work to have?", multi: true, options: [{ label: "Save lives", key: "healthcare" }, { label: "Build wealth", key: "finance" }, { label: "Advance knowledge", key: "science" }, { label: "Create beauty", key: "arts" }, { label: "Protect nature", key: "environment" }, { label: "Empower communities", key: "education" }] },
  { id: "i14", section: "interest", prompt: "Which famous figures inspire you most?", multi: true, options: [{ label: "Elon Musk (tech entrepreneur)", key: "entrepreneurship" }, { label: "Marie Curie (scientist)", key: "science" }, { label: "Ruth Bader Ginsburg (lawyer)", key: "law" }, { label: "Serena Williams (sports)", key: "sports" }, { label: "Banksy (artist)", key: "arts" }, { label: "Angela Merkel (politician)", key: "politics" }] },
  { id: "i15", section: "interest", prompt: "Which extracurricular activities did you most enjoy in school?", multi: true, options: [{ label: "Science fairs", key: "science" }, { label: "Debate club", key: "journalism" }, { label: "Sports teams", key: "sports" }, { label: "Drama / music", key: "arts" }, { label: "Math competitions", key: "engineering" }, { label: "Student government", key: "politics" }] },
  { id: "i16", section: "interest", prompt: "What kind of books or content do you consume most?", multi: true, options: [{ label: "Business biographies", key: "entrepreneurship" }, { label: "Sci-fi / futurism", key: "technology" }, { label: "Psychology & self-help", key: "psychology" }, { label: "Architecture & design", key: "architecture" }, { label: "Sports analysis", key: "sports" }, { label: "Legal & political dramas", key: "law" }] },
  { id: "i17", section: "interest", prompt: "If given a free month to do anything, you would:", multi: true, options: [{ label: "Build an app or product", key: "technology" }, { label: "Travel and explore cultures", key: "education" }, { label: "Learn a sport or craft", key: "sports" }, { label: "Write or make content", key: "journalism" }, { label: "Invest or trade", key: "finance" }, { label: "Volunteer for a cause", key: "environment" }] },
  { id: "i18", section: "interest", prompt: "Which career paths have you seriously considered?", multi: true, options: [{ label: "Doctor or nurse", key: "healthcare" }, { label: "Architect or designer", key: "architecture" }, { label: "Software engineer", key: "engineering" }, { label: "Journalist or writer", key: "journalism" }, { label: "Psychologist or therapist", key: "psychology" }, { label: "Marketing manager", key: "marketing" }] },
  { id: "i19", section: "interest", prompt: "Which of these online courses would you choose to take for free?", multi: true, options: [{ label: "Machine Learning", key: "technology" }, { label: "Environmental Science", key: "environment" }, { label: "Financial Markets", key: "finance" }, { label: "Creative Writing", key: "arts" }, { label: "Human Anatomy", key: "healthcare" }, { label: "Urban Planning", key: "architecture" }] },
  { id: "i20", section: "interest", prompt: "Which work responsibilities energize you most?", multi: true, options: [{ label: "Solving technical problems", key: "engineering" }, { label: "Managing and leading teams", key: "business" }, { label: "Researching and writing reports", key: "science" }, { label: "Designing visuals or spaces", key: "design" }, { label: "Helping and advising people", key: "psychology" }, { label: "Negotiating and making deals", key: "law" }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Session picker — called client-side on each assessment load
// Returns 10 personality + 10 IQ + 10 interest questions (30 total)
// Personality selection guarantees ≥2 questions per MBTI axis
// ─────────────────────────────────────────────────────────────────────────────
export type SessionQuestions = {
  personality: PersonalityQ[];
  iq: CognitiveQ[];
  interest: InterestQ[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickSessionQuestions(): SessionQuestions {
  // Personality: pick 10 with guaranteed ≥2 per axis (EI, SN, TF, JP)
  const axes = ["EI", "SN", "TF", "JP"] as const;
  const byAxis = Object.fromEntries(
    axes.map((ax) => [ax, shuffle(PERSONALITY_BANK.filter((q) => q.axis === ax))])
  ) as Record<typeof axes[number], PersonalityQ[]>;

  const personality: PersonalityQ[] = [];
  // First: guarantee 2 per axis (8 total)
  for (const ax of axes) personality.push(byAxis[ax][0], byAxis[ax][1]);
  // Remaining 2: pick from all un-selected, shuffled
  const used = new Set(personality.map((q) => q.id));
  const remaining = shuffle(PERSONALITY_BANK.filter((q) => !used.has(q.id)));
  personality.push(...remaining.slice(0, 2));

  return {
    personality: shuffle(personality),
    iq: shuffle(IQ_BANK).slice(0, 10),
    interest: shuffle(INTEREST_BANK).slice(0, 10),
  };
}

// Server-side helper: look up correct answer index for an IQ question by id
export function getIQCorrect(id: string): number | null {
  return IQ_BANK.find((q) => q.id === id)?.correct ?? null;
}
