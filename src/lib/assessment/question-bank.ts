// Question Bank — master pool for all assessment questions.
// Expandable: add more questions to each array; the session picker selects 10 from each.

import type { PersonalityQ, CognitiveQ, InterestQ, RiasecDim } from "./career-assessment";

// ─────────────────────────────────────────────────────────────────────────────
// PERSONALITY BANK  (target: 200 questions)
// Currently: 280 questions (70 per MBTI axis × 4 axes)
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

  // ── EI additional (p41–p80) ──
  { id: "p41",  section: "personality", prompt: "You would rather attend a networking event than spend a quiet evening at home.", axis: "EI", direction: 1 },
  { id: "p42",  section: "personality", prompt: "You process your thoughts better by talking them out with others.", axis: "EI", direction: 1 },
  { id: "p43",  section: "personality", prompt: "You often feel lonely when you spend too much time alone.", axis: "EI", direction: 1 },
  { id: "p44",  section: "personality", prompt: "You find small talk enjoyable and easy to maintain.", axis: "EI", direction: 1 },
  { id: "p45",  section: "personality", prompt: "You make friends quickly and have a wide social circle.", axis: "EI", direction: 1 },
  { id: "p46",  section: "personality", prompt: "You are the first to introduce yourself in a room full of strangers.", axis: "EI", direction: 1 },
  { id: "p47",  section: "personality", prompt: "Group brainstorming sessions energize rather than exhaust you.", axis: "EI", direction: 1 },
  { id: "p48",  section: "personality", prompt: "You enjoy phone calls more than text messages.", axis: "EI", direction: 1 },
  { id: "p49",  section: "personality", prompt: "You tend to think out loud rather than reflect silently.", axis: "EI", direction: 1 },
  { id: "p50",  section: "personality", prompt: "You feel comfortable being the spokesperson for your team.", axis: "EI", direction: 1 },
  { id: "p51",  section: "personality", prompt: "You often need silence to concentrate on complex problems.", axis: "EI", direction: -1 },
  { id: "p52",  section: "personality", prompt: "You prefer a small group of close friends over a large social network.", axis: "EI", direction: -1 },
  { id: "p53",  section: "personality", prompt: "You feel more productive when working from home alone.", axis: "EI", direction: -1 },
  { id: "p54",  section: "personality", prompt: "You find it draining to attend back-to-back social events.", axis: "EI", direction: -1 },
  { id: "p55",  section: "personality", prompt: "You often prefer to observe rather than participate in group activities.", axis: "EI", direction: -1 },
  { id: "p56",  section: "personality", prompt: "You would rather send an email than make a phone call.", axis: "EI", direction: -1 },
  { id: "p57",  section: "personality", prompt: "You prefer to work through problems in your head before discussing them.", axis: "EI", direction: -1 },
  { id: "p58",  section: "personality", prompt: "You feel most like yourself when you have long stretches of uninterrupted time.", axis: "EI", direction: -1 },
  { id: "p59",  section: "personality", prompt: "Large parties tend to leave you feeling overstimulated.", axis: "EI", direction: -1 },
  { id: "p60",  section: "personality", prompt: "You enjoy spending weekends doing solitary hobbies like reading or hiking.", axis: "EI", direction: -1 },
  { id: "p61",  section: "personality", prompt: "You enjoy being involved in many activities at the same time.", axis: "EI", direction: 1 },
  { id: "p62",  section: "personality", prompt: "You are energized by presenting your ideas in front of an audience.", axis: "EI", direction: 1 },
  { id: "p63",  section: "personality", prompt: "You get bored quickly when left alone for long periods.", axis: "EI", direction: 1 },
  { id: "p64",  section: "personality", prompt: "You enjoy leading group discussions and facilitating conversations.", axis: "EI", direction: 1 },
  { id: "p65",  section: "personality", prompt: "You tend to share personal experiences freely with people you have just met.", axis: "EI", direction: 1 },
  { id: "p66",  section: "personality", prompt: "You find working in open-plan offices stimulating rather than distracting.", axis: "EI", direction: 1 },
  { id: "p67",  section: "personality", prompt: "You rarely need time to recover after a busy social week.", axis: "EI", direction: 1 },
  { id: "p68",  section: "personality", prompt: "You prefer to keep a few deep, private relationships over many acquaintances.", axis: "EI", direction: -1 },
  { id: "p69",  section: "personality", prompt: "When stressed, you withdraw rather than seek people out.", axis: "EI", direction: -1 },
  { id: "p70",  section: "personality", prompt: "You are selective about who you open up to emotionally.", axis: "EI", direction: -1 },
  { id: "p71",  section: "personality", prompt: "You often rehearse conversations in your head before having them.", axis: "EI", direction: -1 },
  { id: "p72",  section: "personality", prompt: "You find crowded environments mentally taxing.", axis: "EI", direction: -1 },
  { id: "p73",  section: "personality", prompt: "You prefer to listen more than talk in group settings.", axis: "EI", direction: -1 },
  { id: "p74",  section: "personality", prompt: "You enjoy deep one-on-one conversations more than group discussions.", axis: "EI", direction: -1 },
  { id: "p75",  section: "personality", prompt: "After a vacation with many people, you need time alone to decompress.", axis: "EI", direction: -1 },
  { id: "p76",  section: "personality", prompt: "You feel comfortable jumping into conversations without much preparation.", axis: "EI", direction: 1 },
  { id: "p77",  section: "personality", prompt: "You often seek out social activities to lift your mood.", axis: "EI", direction: 1 },
  { id: "p78",  section: "personality", prompt: "You are comfortable being spontaneous and outgoing.", axis: "EI", direction: 1 },
  { id: "p79",  section: "personality", prompt: "Solitude for extended periods makes you restless.", axis: "EI", direction: 1 },
  { id: "p80",  section: "personality", prompt: "You tend to think quietly before contributing to a discussion.", axis: "EI", direction: -1 },

  // ── SN additional (p81–p120) ──
  { id: "p81",  section: "personality", prompt: "You are more interested in what is real and verifiable than in what is possible.", axis: "SN", direction: 1 },
  { id: "p82",  section: "personality", prompt: "You pay close attention to details that others often overlook.", axis: "SN", direction: 1 },
  { id: "p83",  section: "personality", prompt: "You are good at remembering specific facts and figures.", axis: "SN", direction: 1 },
  { id: "p84",  section: "personality", prompt: "You trust what you can see and touch more than abstract theories.", axis: "SN", direction: 1 },
  { id: "p85",  section: "personality", prompt: "You prefer to master one skill thoroughly before moving to the next.", axis: "SN", direction: 1 },
  { id: "p86",  section: "personality", prompt: "You enjoy routine and consistency in your daily work.", axis: "SN", direction: 1 },
  { id: "p87",  section: "personality", prompt: "You prefer to follow established methods rather than invent new ones.", axis: "SN", direction: 1 },
  { id: "p88",  section: "personality", prompt: "You focus on the present situation rather than speculating about the future.", axis: "SN", direction: 1 },
  { id: "p89",  section: "personality", prompt: "You are more practical than philosophical.", axis: "SN", direction: 1 },
  { id: "p90",  section: "personality", prompt: "You believe experience is the best teacher.", axis: "SN", direction: 1 },
  { id: "p91",  section: "personality", prompt: "You are drawn to brainstorming sessions that explore unusual possibilities.", axis: "SN", direction: -1 },
  { id: "p92",  section: "personality", prompt: "You often imagine how things could be different or better.", axis: "SN", direction: -1 },
  { id: "p93",  section: "personality", prompt: "You are more interested in theories and concepts than in facts and details.", axis: "SN", direction: -1 },
  { id: "p94",  section: "personality", prompt: "You often make connections between ideas from completely different fields.", axis: "SN", direction: -1 },
  { id: "p95",  section: "personality", prompt: "You enjoy speculating about the long-term future.", axis: "SN", direction: -1 },
  { id: "p96",  section: "personality", prompt: "You get excited by new ideas even when they are not yet practical.", axis: "SN", direction: -1 },
  { id: "p97",  section: "personality", prompt: "You tend to read between the lines rather than take things at face value.", axis: "SN", direction: -1 },
  { id: "p98",  section: "personality", prompt: "You are more comfortable with ambiguity than with rigid structure.", axis: "SN", direction: -1 },
  { id: "p99",  section: "personality", prompt: "You frequently find yourself daydreaming about future possibilities.", axis: "SN", direction: -1 },
  { id: "p100", section: "personality", prompt: "You trust your intuition as much as, or more than, your experience.", axis: "SN", direction: -1 },
  { id: "p101", section: "personality", prompt: "You prefer a clear job description with well-defined tasks.", axis: "SN", direction: 1 },
  { id: "p102", section: "personality", prompt: "You find comfort in established traditions and proven methods.", axis: "SN", direction: 1 },
  { id: "p103", section: "personality", prompt: "You prefer instruction manuals to trial-and-error learning.", axis: "SN", direction: 1 },
  { id: "p104", section: "personality", prompt: "You find purely theoretical discussions unproductive if they lack real-world application.", axis: "SN", direction: 1 },
  { id: "p105", section: "personality", prompt: "You notice when something in your environment has changed, even slightly.", axis: "SN", direction: 1 },
  { id: "p106", section: "personality", prompt: "You prefer tasks that have a tangible, measurable outcome.", axis: "SN", direction: 1 },
  { id: "p107", section: "personality", prompt: "You enjoy working with facts, data, and concrete information.", axis: "SN", direction: 1 },
  { id: "p108", section: "personality", prompt: "You are intrigued by underlying patterns that connect disparate things.", axis: "SN", direction: -1 },
  { id: "p109", section: "personality", prompt: "You often think in metaphors and symbols.", axis: "SN", direction: -1 },
  { id: "p110", section: "personality", prompt: "You prefer working on innovative problems over routine ones.", axis: "SN", direction: -1 },
  { id: "p111", section: "personality", prompt: "You love exploring 'what if' scenarios even when they are hypothetical.", axis: "SN", direction: -1 },
  { id: "p112", section: "personality", prompt: "You often envision multiple future outcomes before making a decision.", axis: "SN", direction: -1 },
  { id: "p113", section: "personality", prompt: "You are energized by open-ended questions that have no single answer.", axis: "SN", direction: -1 },
  { id: "p114", section: "personality", prompt: "You find repetitive, detail-oriented work tedious.", axis: "SN", direction: -1 },
  { id: "p115", section: "personality", prompt: "You are more interested in the big picture than in the specifics.", axis: "SN", direction: -1 },
  { id: "p116", section: "personality", prompt: "When solving problems, you prefer to stick to tried-and-true approaches.", axis: "SN", direction: 1 },
  { id: "p117", section: "personality", prompt: "You prefer concrete goals over abstract visions.", axis: "SN", direction: 1 },
  { id: "p118", section: "personality", prompt: "You notice details in your physical environment that others miss.", axis: "SN", direction: 1 },
  { id: "p119", section: "personality", prompt: "You tend to think about what is most likely, not what is most imaginative.", axis: "SN", direction: 1 },
  { id: "p120", section: "personality", prompt: "You often get absorbed in a vision for the future and lose track of the present.", axis: "SN", direction: -1 },

  // ── TF additional (p121–p160) ──
  { id: "p121", section: "personality", prompt: "When giving feedback, you focus on what can be improved rather than on feelings.", axis: "TF", direction: 1 },
  { id: "p122", section: "personality", prompt: "You believe the most ethical choice is the one that maximizes rational benefit.", axis: "TF", direction: 1 },
  { id: "p123", section: "personality", prompt: "You can argue a position you disagree with just to explore all sides logically.", axis: "TF", direction: 1 },
  { id: "p124", section: "personality", prompt: "You prefer to be respected rather than liked.", axis: "TF", direction: 1 },
  { id: "p125", section: "personality", prompt: "You separate emotional reactions from the actual problem when problem-solving.", axis: "TF", direction: 1 },
  { id: "p126", section: "personality", prompt: "You are more persuaded by sound arguments than emotional appeals.", axis: "TF", direction: 1 },
  { id: "p127", section: "personality", prompt: "You find it easy to make decisions without second-guessing the emotional impact.", axis: "TF", direction: 1 },
  { id: "p128", section: "personality", prompt: "You often point out flaws in plans even if it upsets the group dynamic.", axis: "TF", direction: 1 },
  { id: "p129", section: "personality", prompt: "You believe rules and standards should apply equally to everyone.", axis: "TF", direction: 1 },
  { id: "p130", section: "personality", prompt: "When a friend asks for advice, you give honest feedback rather than comfort.", axis: "TF", direction: 1 },
  { id: "p131", section: "personality", prompt: "You consider how decisions will make people feel before you commit to them.", axis: "TF", direction: -1 },
  { id: "p132", section: "personality", prompt: "Maintaining group harmony is important, even if it means compromising.", axis: "TF", direction: -1 },
  { id: "p133", section: "personality", prompt: "You are deeply affected by criticism directed at you.", axis: "TF", direction: -1 },
  { id: "p134", section: "personality", prompt: "You find it difficult to say something harsh even when it is true.", axis: "TF", direction: -1 },
  { id: "p135", section: "personality", prompt: "The emotional climate of a room strongly influences your mood.", axis: "TF", direction: -1 },
  { id: "p136", section: "personality", prompt: "When someone is upset, your first instinct is to console them.", axis: "TF", direction: -1 },
  { id: "p137", section: "personality", prompt: "You believe relationships matter more than being correct.", axis: "TF", direction: -1 },
  { id: "p138", section: "personality", prompt: "You often sense how others are feeling without them saying anything.", axis: "TF", direction: -1 },
  { id: "p139", section: "personality", prompt: "You avoid confrontations because they feel emotionally costly.", axis: "TF", direction: -1 },
  { id: "p140", section: "personality", prompt: "You take pride in the positive impact you have on the people around you.", axis: "TF", direction: -1 },
  { id: "p141", section: "personality", prompt: "You apply consistent logical criteria when judging your own and others' work.", axis: "TF", direction: 1 },
  { id: "p142", section: "personality", prompt: "You prefer performance reviews that are blunt and data-driven over kind but vague.", axis: "TF", direction: 1 },
  { id: "p143", section: "personality", prompt: "Efficiency and competence matter more to you than relatability.", axis: "TF", direction: 1 },
  { id: "p144", section: "personality", prompt: "You do not let personal loyalties cloud objective judgment.", axis: "TF", direction: 1 },
  { id: "p145", section: "personality", prompt: "You believe emotions should be checked at the door in professional settings.", axis: "TF", direction: 1 },
  { id: "p146", section: "personality", prompt: "You find it easy to debate a topic without taking disagreement personally.", axis: "TF", direction: 1 },
  { id: "p147", section: "personality", prompt: "When making a major life decision, logic outweighs personal sentiment.", axis: "TF", direction: 1 },
  { id: "p148", section: "personality", prompt: "You feel guilty when you have to prioritize efficiency over someone's feelings.", axis: "TF", direction: -1 },
  { id: "p149", section: "personality", prompt: "You feel a strong need to ensure no one feels left out or excluded.", axis: "TF", direction: -1 },
  { id: "p150", section: "personality", prompt: "You would rather lose an argument than damage a relationship.", axis: "TF", direction: -1 },
  { id: "p151", section: "personality", prompt: "Your mood is often influenced by the emotional tone of conversations around you.", axis: "TF", direction: -1 },
  { id: "p152", section: "personality", prompt: "You notice when someone is emotionally struggling even before they say so.", axis: "TF", direction: -1 },
  { id: "p153", section: "personality", prompt: "You tend to give people the benefit of the doubt based on their circumstances.", axis: "TF", direction: -1 },
  { id: "p154", section: "personality", prompt: "You find purely objective decisions that ignore human cost unsatisfying.", axis: "TF", direction: -1 },
  { id: "p155", section: "personality", prompt: "You are quick to notice and acknowledge others' contributions publicly.", axis: "TF", direction: -1 },
  { id: "p156", section: "personality", prompt: "You prioritize getting the right answer over maintaining team morale.", axis: "TF", direction: 1 },
  { id: "p157", section: "personality", prompt: "You would restructure a team for efficiency even if it hurt feelings.", axis: "TF", direction: 1 },
  { id: "p158", section: "personality", prompt: "You find it more important to be consistent than compassionate.", axis: "TF", direction: 1 },
  { id: "p159", section: "personality", prompt: "When someone complains, you instinctively look for the solution, not the sympathy.", axis: "TF", direction: 1 },
  { id: "p160", section: "personality", prompt: "You find it hard to stay neutral when someone you care about is hurting.", axis: "TF", direction: -1 },

  // ── JP additional (p161–p200) ──
  { id: "p161", section: "personality", prompt: "You feel most in control when your calendar is fully planned.", axis: "JP", direction: 1 },
  { id: "p162", section: "personality", prompt: "You make decisions quickly so you can move on rather than keeping options open.", axis: "JP", direction: 1 },
  { id: "p163", section: "personality", prompt: "You find it satisfying to check items off a to-do list.", axis: "JP", direction: 1 },
  { id: "p164", section: "personality", prompt: "You prefer to arrive early rather than risk being late.", axis: "JP", direction: 1 },
  { id: "p165", section: "personality", prompt: "You feel uneasy when your workspace or living area is disorganized.", axis: "JP", direction: 1 },
  { id: "p166", section: "personality", prompt: "You prefer to finish one project completely before starting another.", axis: "JP", direction: 1 },
  { id: "p167", section: "personality", prompt: "You enjoy following a structured daily routine.", axis: "JP", direction: 1 },
  { id: "p168", section: "personality", prompt: "You like to decide on travel plans well in advance.", axis: "JP", direction: 1 },
  { id: "p169", section: "personality", prompt: "Having clear expectations and defined roles reduces your stress significantly.", axis: "JP", direction: 1 },
  { id: "p170", section: "personality", prompt: "Unresolved issues nag at you until they are dealt with.", axis: "JP", direction: 1 },
  { id: "p171", section: "personality", prompt: "You enjoy last-minute plans and spontaneous decisions.", axis: "JP", direction: -1 },
  { id: "p172", section: "personality", prompt: "You often leave decisions open as long as possible to keep your options flexible.", axis: "JP", direction: -1 },
  { id: "p173", section: "personality", prompt: "You find strict schedules confining and prefer to work at your own pace.", axis: "JP", direction: -1 },
  { id: "p174", section: "personality", prompt: "You are comfortable starting tasks without knowing exactly how you will finish them.", axis: "JP", direction: -1 },
  { id: "p175", section: "personality", prompt: "You tend to do your best work under the pressure of an approaching deadline.", axis: "JP", direction: -1 },
  { id: "p176", section: "personality", prompt: "You feel comfortable leaving some things undone if something more interesting comes up.", axis: "JP", direction: -1 },
  { id: "p177", section: "personality", prompt: "You prefer a flexible plan that can adapt rather than a fixed schedule.", axis: "JP", direction: -1 },
  { id: "p178", section: "personality", prompt: "You find structured environments stifling to your creativity.", axis: "JP", direction: -1 },
  { id: "p179", section: "personality", prompt: "You enjoy the process of exploration more than the act of reaching a conclusion.", axis: "JP", direction: -1 },
  { id: "p180", section: "personality", prompt: "You prefer to keep your weekends unplanned so you can do whatever feels right.", axis: "JP", direction: -1 },
  { id: "p181", section: "personality", prompt: "You feel most productive when working from a prioritized task list.", axis: "JP", direction: 1 },
  { id: "p182", section: "personality", prompt: "You find satisfaction in seeing a long-term plan come together as designed.", axis: "JP", direction: 1 },
  { id: "p183", section: "personality", prompt: "You prefer to resolve conflicts quickly rather than let them linger.", axis: "JP", direction: 1 },
  { id: "p184", section: "personality", prompt: "You create detailed plans before starting a new project.", axis: "JP", direction: 1 },
  { id: "p185", section: "personality", prompt: "Ambiguity in your responsibilities makes you anxious.", axis: "JP", direction: 1 },
  { id: "p186", section: "personality", prompt: "You like to commit to a decision and then execute without second-guessing.", axis: "JP", direction: 1 },
  { id: "p187", section: "personality", prompt: "You would rather over-prepare than improvise in an important situation.", axis: "JP", direction: 1 },
  { id: "p188", section: "personality", prompt: "You enjoy doing the same thing in different ways each time, depending on your mood.", axis: "JP", direction: -1 },
  { id: "p189", section: "personality", prompt: "You often start many interesting projects but struggle to finish them all.", axis: "JP", direction: -1 },
  { id: "p190", section: "personality", prompt: "You feel energized when you can respond to changing circumstances in real time.", axis: "JP", direction: -1 },
  { id: "p191", section: "personality", prompt: "You prefer to wing it when traveling rather than planning every detail in advance.", axis: "JP", direction: -1 },
  { id: "p192", section: "personality", prompt: "You find that too much planning kills your spontaneity.", axis: "JP", direction: -1 },
  { id: "p193", section: "personality", prompt: "You sometimes put off decisions just to see how things develop naturally.", axis: "JP", direction: -1 },
  { id: "p194", section: "personality", prompt: "You prefer open-ended projects over those with a defined scope and deadline.", axis: "JP", direction: -1 },
  { id: "p195", section: "personality", prompt: "Unexpected changes in plan are opportunities rather than problems.", axis: "JP", direction: -1 },
  { id: "p196", section: "personality", prompt: "You keep a detailed calendar and rarely miss scheduled commitments.", axis: "JP", direction: 1 },
  { id: "p197", section: "personality", prompt: "You find it hard to relax when there are unfinished tasks on your list.", axis: "JP", direction: 1 },
  { id: "p198", section: "personality", prompt: "You prefer a working environment with clear rules and predictable outcomes.", axis: "JP", direction: 1 },
  { id: "p199", section: "personality", prompt: "You feel most creative when you have complete freedom with no fixed plan.", axis: "JP", direction: -1 },
  { id: "p200", section: "personality", prompt: "You find it more stressful to have too many open options than too few.", axis: "JP", direction: 1 },

  // ── EI additional (p201–p220) ──
  { id: "p201", section: "personality", prompt: "You find group problem-solving sessions more productive than working alone.", axis: "EI", direction: 1 },
  { id: "p202", section: "personality", prompt: "You think better when you can talk your ideas through with someone.", axis: "EI", direction: 1 },
  { id: "p203", section: "personality", prompt: "You feel recharged and motivated after spending an evening with friends.", axis: "EI", direction: 1 },
  { id: "p204", section: "personality", prompt: "You often take the initiative to contact people rather than waiting for them to reach out.", axis: "EI", direction: 1 },
  { id: "p205", section: "personality", prompt: "Working from home for extended periods makes you feel isolated and unmotivated.", axis: "EI", direction: 1 },
  { id: "p206", section: "personality", prompt: "You feel most confident and articulate when speaking in front of a group.", axis: "EI", direction: 1 },
  { id: "p207", section: "personality", prompt: "You enjoy attending social events even if you don't know many people there.", axis: "EI", direction: 1 },
  { id: "p208", section: "personality", prompt: "You feel comfortable jumping into group activities without knowing everyone involved.", axis: "EI", direction: 1 },
  { id: "p209", section: "personality", prompt: "You feel bored and restless when you go several days without social interaction.", axis: "EI", direction: 1 },
  { id: "p210", section: "personality", prompt: "You find it easy to keep a conversation going even with people you have just met.", axis: "EI", direction: 1 },
  { id: "p211", section: "personality", prompt: "You find yourself easily distracted in open-plan or noisy environments.", axis: "EI", direction: -1 },
  { id: "p212", section: "personality", prompt: "You prefer to develop ideas fully in your head before sharing them with others.", axis: "EI", direction: -1 },
  { id: "p213", section: "personality", prompt: "You feel more at ease in a small, intimate gathering than at a large party.", axis: "EI", direction: -1 },
  { id: "p214", section: "personality", prompt: "After a week of intensive social interactions, you need several days to fully recover.", axis: "EI", direction: -1 },
  { id: "p215", section: "personality", prompt: "You are selective about how much you share with people you haven't known for long.", axis: "EI", direction: -1 },
  { id: "p216", section: "personality", prompt: "You feel uncomfortable when people drop by unexpectedly without warning.", axis: "EI", direction: -1 },
  { id: "p217", section: "personality", prompt: "Your best ideas tend to come when you are alone and completely undisturbed.", axis: "EI", direction: -1 },
  { id: "p218", section: "personality", prompt: "You feel more comfortable contributing in writing or by email than in live discussions.", axis: "EI", direction: -1 },
  { id: "p219", section: "personality", prompt: "You often need quiet time after work before you feel ready to socialize.", axis: "EI", direction: -1 },
  { id: "p220", section: "personality", prompt: "You generally need more time to warm up to new people than most others seem to.", axis: "EI", direction: -1 },

  // ── SN additional (p221–p240) ──
  { id: "p221", section: "personality", prompt: "You prefer working with established methods that have been proven to work reliably.", axis: "SN", direction: 1 },
  { id: "p222", section: "personality", prompt: "You trust data and evidence far more than gut feelings or untested intuition.", axis: "SN", direction: 1 },
  { id: "p223", section: "personality", prompt: "You focus on the current situation rather than speculating about distant possibilities.", axis: "SN", direction: 1 },
  { id: "p224", section: "personality", prompt: "You find it more satisfying to master a practical skill than to explore a new theory.", axis: "SN", direction: 1 },
  { id: "p225", section: "personality", prompt: "You prefer precise instructions with clear measurements rather than vague approximations.", axis: "SN", direction: 1 },
  { id: "p226", section: "personality", prompt: "You find hands-on demonstrations more useful than theoretical models.", axis: "SN", direction: 1 },
  { id: "p227", section: "personality", prompt: "You tend to describe situations in literal, concrete terms rather than with metaphors.", axis: "SN", direction: 1 },
  { id: "p228", section: "personality", prompt: "You value practical experience more than academic qualifications when assessing someone.", axis: "SN", direction: 1 },
  { id: "p229", section: "personality", prompt: "You focus on what is actually happening rather than what could theoretically happen.", axis: "SN", direction: 1 },
  { id: "p230", section: "personality", prompt: "You prefer learning by doing rather than by reading about a topic first.", axis: "SN", direction: 1 },
  { id: "p231", section: "personality", prompt: "You love exploring hypothetical scenarios and 'what if' questions.", axis: "SN", direction: -1 },
  { id: "p232", section: "personality", prompt: "You often notice hidden connections between things that seem completely unrelated.", axis: "SN", direction: -1 },
  { id: "p233", section: "personality", prompt: "You find yourself daydreaming about future possibilities more than focusing on the present.", axis: "SN", direction: -1 },
  { id: "p234", section: "personality", prompt: "You prefer projects that require creative problem-solving over routine, repetitive tasks.", axis: "SN", direction: -1 },
  { id: "p235", section: "personality", prompt: "You enjoy reading books that explore abstract, philosophical, or speculative ideas.", axis: "SN", direction: -1 },
  { id: "p236", section: "personality", prompt: "You feel most engaged when a task requires imagination and novel approaches.", axis: "SN", direction: -1 },
  { id: "p237", section: "personality", prompt: "You trust your hunches and gut feelings when making important decisions.", axis: "SN", direction: -1 },
  { id: "p238", section: "personality", prompt: "You find it more interesting to think about why something works than exactly how it works.", axis: "SN", direction: -1 },
  { id: "p239", section: "personality", prompt: "You enjoy thinking about how current trends might shape the distant future.", axis: "SN", direction: -1 },
  { id: "p240", section: "personality", prompt: "You often come up with ideas that others consider unconventional or ahead of their time.", axis: "SN", direction: -1 },

  // ── TF additional (p241–p260) ──
  { id: "p241", section: "personality", prompt: "When evaluating a decision, you focus on logical consequences rather than personal impact.", axis: "TF", direction: 1 },
  { id: "p242", section: "personality", prompt: "You believe it is more important to be correct than to be liked.", axis: "TF", direction: 1 },
  { id: "p243", section: "personality", prompt: "You prefer honest, direct feedback over encouraging but vague praise.", axis: "TF", direction: 1 },
  { id: "p244", section: "personality", prompt: "You are comfortable making tough decisions even when they upset people around you.", axis: "TF", direction: 1 },
  { id: "p245", section: "personality", prompt: "You consciously separate emotions from analysis when working through a complex problem.", axis: "TF", direction: 1 },
  { id: "p246", section: "personality", prompt: "You find it frustrating when important decisions are driven by sentiment rather than evidence.", axis: "TF", direction: 1 },
  { id: "p247", section: "personality", prompt: "You prefer to evaluate work against objective criteria rather than subjective impressions.", axis: "TF", direction: 1 },
  { id: "p248", section: "personality", prompt: "When mediating a conflict, you focus on reaching a fair outcome rather than keeping everyone happy.", axis: "TF", direction: 1 },
  { id: "p249", section: "personality", prompt: "You apply the same principles consistently to all people, regardless of your personal feelings.", axis: "TF", direction: 1 },
  { id: "p250", section: "personality", prompt: "You find emotional appeals in arguments less persuasive than factual reasoning.", axis: "TF", direction: 1 },
  { id: "p251", section: "personality", prompt: "You find it difficult to disagree with someone you care about, even when you know they are wrong.", axis: "TF", direction: -1 },
  { id: "p252", section: "personality", prompt: "You tend to take criticism personally even when it is intended constructively.", axis: "TF", direction: -1 },
  { id: "p253", section: "personality", prompt: "When a friend is upset, your first instinct is to offer comfort rather than immediate solutions.", axis: "TF", direction: -1 },
  { id: "p254", section: "personality", prompt: "You naturally sense the emotional atmosphere of a room as soon as you enter it.", axis: "TF", direction: -1 },
  { id: "p255", section: "personality", prompt: "You make most of your decisions based on how they feel rather than on logical analysis.", axis: "TF", direction: -1 },
  { id: "p256", section: "personality", prompt: "Knowing that someone is hurt by your decision makes you want to reconsider it, even if it was the right call.", axis: "TF", direction: -1 },
  { id: "p257", section: "personality", prompt: "You prioritise maintaining harmony in a group over pushing through the most logical outcome.", axis: "TF", direction: -1 },
  { id: "p258", section: "personality", prompt: "You believe a decision that leaves no one hurt is always preferable to the most efficient one.", axis: "TF", direction: -1 },
  { id: "p259", section: "personality", prompt: "You are deeply affected by stories of injustice and human suffering.", axis: "TF", direction: -1 },
  { id: "p260", section: "personality", prompt: "You consider the feelings and values of those involved a core factor in any decision you make.", axis: "TF", direction: -1 },

  // ── JP additional (p261–p280) ──
  { id: "p261", section: "personality", prompt: "You feel most confident starting a task when you have a clear, step-by-step plan in place.", axis: "JP", direction: 1 },
  { id: "p262", section: "personality", prompt: "You dislike last-minute changes to plans even when the change is an improvement.", axis: "JP", direction: 1 },
  { id: "p263", section: "personality", prompt: "Once you decide on a course of action, you follow through rather than continuously re-evaluating.", axis: "JP", direction: 1 },
  { id: "p264", section: "personality", prompt: "You find it easy to say no to new requests when you already have a full schedule.", axis: "JP", direction: 1 },
  { id: "p265", section: "personality", prompt: "You find it rewarding to wrap up all tasks before moving on to new ones.", axis: "JP", direction: 1 },
  { id: "p266", section: "personality", prompt: "You schedule personal time and rest the same deliberate way you schedule work commitments.", axis: "JP", direction: 1 },
  { id: "p267", section: "personality", prompt: "When starting a new project, you map out a full plan before writing the first line.", axis: "JP", direction: 1 },
  { id: "p268", section: "personality", prompt: "You feel most at ease when you know what to expect for the rest of the day.", axis: "JP", direction: 1 },
  { id: "p269", section: "personality", prompt: "You often make lists and organise your belongings by category or system.", axis: "JP", direction: 1 },
  { id: "p270", section: "personality", prompt: "You feel a genuine sense of satisfaction when you complete everything on your daily task list.", axis: "JP", direction: 1 },
  { id: "p271", section: "personality", prompt: "You often change plans mid-course when something more interesting or promising comes along.", axis: "JP", direction: -1 },
  { id: "p272", section: "personality", prompt: "You prefer to work in bursts of inspiration rather than on a fixed, predictable schedule.", axis: "JP", direction: -1 },
  { id: "p273", section: "personality", prompt: "You feel restless when locked into a fixed plan that leaves no room for improvisation.", axis: "JP", direction: -1 },
  { id: "p274", section: "personality", prompt: "You tend to gather more and more information before finally committing to a decision.", axis: "JP", direction: -1 },
  { id: "p275", section: "personality", prompt: "You feel perfectly comfortable starting a project without knowing exactly how it will end.", axis: "JP", direction: -1 },
  { id: "p276", section: "personality", prompt: "You prefer flexible, negotiable deadlines over hard, fixed ones.", axis: "JP", direction: -1 },
  { id: "p277", section: "personality", prompt: "Your best creative ideas tend to emerge when you have no fixed agenda or structure.", axis: "JP", direction: -1 },
  { id: "p278", section: "personality", prompt: "You keep your long-term goals loosely defined so you can adapt as new opportunities arise.", axis: "JP", direction: -1 },
  { id: "p279", section: "personality", prompt: "You enjoy trying new approaches to familiar problems even when the old one works just fine.", axis: "JP", direction: -1 },
  { id: "p280", section: "personality", prompt: "You feel most alive when you have several exciting but unfinished projects on the go at once.", axis: "JP", direction: -1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// IQ / COGNITIVE BANK  (target: 200 questions)
// Currently: 260 questions (c1–c10, iq1–iq250)
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
  { id: "iq24", section: "cognitive", prompt: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°","7.5°","15°","22.5°"], correct: 1 },
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

  // ── Number sequences (iq51–iq80) ──
  { id: "iq51",  section: "cognitive", prompt: "What comes next: 2, 4, 8, 16, 32, ?", options: ["48","56","64","72"], correct: 2 },
  { id: "iq52",  section: "cognitive", prompt: "What comes next: 100, 91, 83, 76, 70, ?", options: ["63","65","67","69"], correct: 1 },
  { id: "iq53",  section: "cognitive", prompt: "What comes next: 1, 1, 2, 3, 5, 8, 13, ?", options: ["18","20","21","24"], correct: 2 },
  { id: "iq54",  section: "cognitive", prompt: "What is the missing number: 5, 11, 23, 47, ?, 191", options: ["93","95","97","99"], correct: 1 },
  { id: "iq55",  section: "cognitive", prompt: "Find the missing number: 3, 9, 27, 81, ?", options: ["162","243","324","405"], correct: 1 },
  { id: "iq56",  section: "cognitive", prompt: "What number replaces ?: 7, 14, 28, 56, ?", options: ["96","112","120","128"], correct: 1 },
  { id: "iq57",  section: "cognitive", prompt: "Complete the series: 50, 48, 44, 38, 30, ?", options: ["18","20","22","24"], correct: 1 },
  { id: "iq58",  section: "cognitive", prompt: "What is the next number: 1, 4, 10, 22, 46, ?", options: ["84","92","94","96"], correct: 2 },
  { id: "iq59",  section: "cognitive", prompt: "Find the next term: 6, 11, 21, 41, 81, ?", options: ["131","151","161","171"], correct: 2 },
  { id: "iq60",  section: "cognitive", prompt: "What comes next: 1, 3, 7, 15, 31, ?", options: ["57","61","63","67"], correct: 2 },
  { id: "iq61",  section: "cognitive", prompt: "Complete: 120, 60, 20, 5, ?", options: ["0.5","1","1.25","1.5"], correct: 2 },
  { id: "iq62",  section: "cognitive", prompt: "What comes next: 2, 6, 18, 54, ?", options: ["108","148","162","216"], correct: 2 },
  { id: "iq63",  section: "cognitive", prompt: "Find the missing value: 1, 8, 27, 64, ?, 216", options: ["100","112","125","135"], correct: 2 },
  { id: "iq64",  section: "cognitive", prompt: "Next term: 0, 1, 3, 6, 10, 15, ?", options: ["19","20","21","22"], correct: 2 },
  { id: "iq65",  section: "cognitive", prompt: "What comes next: 256, 128, 64, 32, ?", options: ["8","12","16","24"], correct: 2 },
  { id: "iq66",  section: "cognitive", prompt: "Fill the blank: 5, 6, 8, 11, 15, 20, ?", options: ["24","25","26","27"], correct: 2 },
  { id: "iq67",  section: "cognitive", prompt: "Next number: 4, 7, 12, 19, 28, ?", options: ["37","38","39","40"], correct: 2 },
  { id: "iq68",  section: "cognitive", prompt: "Complete: 2, 3, 5, 7, 11, 13, ?", options: ["15","17","19","21"], correct: 1 },
  { id: "iq69",  section: "cognitive", prompt: "What is missing: 1, 2, 4, 7, 11, 16, ?", options: ["20","21","22","23"], correct: 2 },
  { id: "iq70",  section: "cognitive", prompt: "Next term: 64, 32, 16, 8, 4, ?", options: ["0","1","2","3"], correct: 2 },
  { id: "iq71",  section: "cognitive", prompt: "Find the next: 12, 24, 48, 96, ?", options: ["144","168","192","200"], correct: 2 },
  { id: "iq72",  section: "cognitive", prompt: "Complete: 1000, 500, 250, 125, ?", options: ["50","60","62.5","65"], correct: 2 },
  { id: "iq73",  section: "cognitive", prompt: "What comes next: 3, 5, 9, 17, 33, ?", options: ["55","60","61","65"], correct: 3 },
  { id: "iq74",  section: "cognitive", prompt: "Next in series: 10, 9, 7, 4, 0, ?", options: ["-3","-4","-5","-6"], correct: 2 },
  { id: "iq75",  section: "cognitive", prompt: "What comes after: 1, 5, 14, 30, 55, ?", options: ["80","88","91","95"], correct: 2 },
  { id: "iq76",  section: "cognitive", prompt: "Find the next: 2, 5, 10, 17, 26, ?", options: ["35","36","37","38"], correct: 2 },
  { id: "iq77",  section: "cognitive", prompt: "Next value: 72, 36, 18, 9, ?", options: ["3","4","4.5","5"], correct: 2 },
  { id: "iq78",  section: "cognitive", prompt: "Complete: 1, 4, 9, 16, 25, 36, ?", options: ["42","47","49","51"], correct: 2 },
  { id: "iq79",  section: "cognitive", prompt: "What replaces ?: 2, 12, 36, 80, 150, ?", options: ["222","245","252","260"], correct: 2 },
  { id: "iq80",  section: "cognitive", prompt: "Next in pattern: 3, 6, 11, 18, 27, 38, ?", options: ["49","51","52","54"], correct: 1 },

  // ── Verbal analogies & reasoning (iq81–iq110) ──
  { id: "iq81",  section: "cognitive", prompt: "Doctor is to Hospital as Teacher is to:", options: ["Classroom","School","Lecture","University"], correct: 1 },
  { id: "iq82",  section: "cognitive", prompt: "Fish is to Water as Bird is to:", options: ["Wing","Sky","Feather","Air"], correct: 1 },
  { id: "iq83",  section: "cognitive", prompt: "Pen is to Writer as Scalpel is to:", options: ["Hospital","Patient","Surgeon","Nurse"], correct: 2 },
  { id: "iq84",  section: "cognitive", prompt: "Marathon is to Running as Regatta is to:", options: ["Swimming","Cycling","Sailing","Rowing"], correct: 2 },
  { id: "iq85",  section: "cognitive", prompt: "Autobiography is to Author as Portrait is to:", options: ["Gallery","Model","Painter","Canvas"], correct: 2 },
  { id: "iq86",  section: "cognitive", prompt: "Gloves are to Hands as Helmet is to:", options: ["Neck","Head","Shoulders","Face"], correct: 1 },
  { id: "iq87",  section: "cognitive", prompt: "Which word is the odd one out: Ruby, Sapphire, Emerald, Pearl, Diamond?", options: ["Ruby","Pearl","Diamond","Sapphire"], correct: 1 },
  { id: "iq88",  section: "cognitive", prompt: "Which word does NOT belong: Comet, Meteor, Planet, Asteroid, Satellite?", options: ["Comet","Planet","Meteor","Asteroid"], correct: 1 },
  { id: "iq89",  section: "cognitive", prompt: "Which word is the odd one out: Orchestra, Symphony, Concerto, Sonata, Fugue?", options: ["Orchestra","Symphony","Concerto","Sonata"], correct: 0 },
  { id: "iq90",  section: "cognitive", prompt: "Loud is to Quiet as Swift is to:", options: ["Fast","Slow","Silent","Still"], correct: 1 },
  { id: "iq91",  section: "cognitive", prompt: "Which word means the same as TENACIOUS?", options: ["Fragile","Persistent","Calm","Flexible"], correct: 1 },
  { id: "iq92",  section: "cognitive", prompt: "Which word is OPPOSITE to BENEVOLENT?", options: ["Generous","Malevolent","Indifferent","Neutral"], correct: 1 },
  { id: "iq93",  section: "cognitive", prompt: "Which word means the same as VERBOSE?", options: ["Brief","Concise","Wordy","Silent"], correct: 2 },
  { id: "iq94",  section: "cognitive", prompt: "Which is OPPOSITE to TRANSIENT?", options: ["Fleeting","Permanent","Brief","Temporary"], correct: 1 },
  { id: "iq95",  section: "cognitive", prompt: "Which word is closest in meaning to SAGACIOUS?", options: ["Wise","Foolish","Young","Careless"], correct: 0 },
  { id: "iq96",  section: "cognitive", prompt: "Complete: LIGHT is to ILLUMINATE as DARK is to:", options: ["Shadow","Obscure","Night","Dim"], correct: 1 },
  { id: "iq97",  section: "cognitive", prompt: "Which word does NOT belong: Triangle, Square, Pentagon, Sphere, Hexagon?", options: ["Triangle","Square","Sphere","Hexagon"], correct: 2 },
  { id: "iq98",  section: "cognitive", prompt: "Architect is to Blueprint as Composer is to:", options: ["Orchestra","Score","Conductor","Piano"], correct: 1 },
  { id: "iq99",  section: "cognitive", prompt: "Which word means the same as EBULLIENT?", options: ["Depressed","Enthusiastic","Calm","Reserved"], correct: 1 },
  { id: "iq100", section: "cognitive", prompt: "Flock is to Birds as Pack is to:", options: ["Fish","Bees","Wolves","Crows"], correct: 2 },
  { id: "iq101", section: "cognitive", prompt: "Which word is OPPOSITE to PRODIGAL?", options: ["Wasteful","Extravagant","Thrifty","Generous"], correct: 2 },
  { id: "iq102", section: "cognitive", prompt: "Eye is to See as Ear is to:", options: ["Sound","Hear","Listen","Noise"], correct: 1 },
  { id: "iq103", section: "cognitive", prompt: "Which word is the odd one out: Rose, Tulip, Oak, Daisy, Lily?", options: ["Rose","Tulip","Oak","Lily"], correct: 2 },
  { id: "iq104", section: "cognitive", prompt: "Hunger is to Food as Thirst is to:", options: ["Drink","Water","Juice","Liquid"], correct: 1 },
  { id: "iq105", section: "cognitive", prompt: "Which word means the same as LUCID?", options: ["Confused","Clear","Dark","Dense"], correct: 1 },
  { id: "iq106", section: "cognitive", prompt: "Microscope is to Biology as Telescope is to:", options: ["Physics","Chemistry","Astronomy","Geography"], correct: 2 },
  { id: "iq107", section: "cognitive", prompt: "Which does NOT belong: Iron, Gold, Mercury, Bronze, Platinum?", options: ["Iron","Gold","Mercury","Bronze"], correct: 3 },
  { id: "iq108", section: "cognitive", prompt: "Which word is closest in meaning to ACRIMONIOUS?", options: ["Sweet","Bitter","Mild","Neutral"], correct: 1 },
  { id: "iq109", section: "cognitive", prompt: "Tree is to Forest as Star is to:", options: ["Sky","Planet","Galaxy","Moon"], correct: 2 },
  { id: "iq110", section: "cognitive", prompt: "Which word is OPPOSITE to LOQUACIOUS?", options: ["Talkative","Verbose","Taciturn","Eloquent"], correct: 2 },

  // ── Logic & deduction (iq111–iq140) ──
  { id: "iq111", section: "cognitive", prompt: "All mammals are warm-blooded. A bat is a mammal. Therefore:", options: ["Bats are cold-blooded","Bats are warm-blooded","Not all bats are mammals","Bats are reptiles"], correct: 1 },
  { id: "iq112", section: "cognitive", prompt: "No fish are mammals. All dolphins are mammals. Therefore:", options: ["Some dolphins are fish","No dolphin is a fish","All fish are dolphins","Some fish are dolphins"], correct: 1 },
  { id: "iq113", section: "cognitive", prompt: "If it rains, the ground gets wet. The ground is wet. What can you conclude?", options: ["It rained","It may or may not have rained","It did not rain","Something else caused it"], correct: 1 },
  { id: "iq114", section: "cognitive", prompt: "Anna is older than Ben. Carl is older than Anna. Who is the youngest?", options: ["Anna","Ben","Carl","Cannot tell"], correct: 1 },
  { id: "iq115", section: "cognitive", prompt: "If P → Q and Q → R, which must be true?", options: ["R → P","P → R","Q → P","R → Q"], correct: 1 },
  { id: "iq116", section: "cognitive", prompt: "Five people sit in a row. Alice sits to the right of Bob. Carol sits to the left of Bob. Dave sits to the right of Alice. Eve is at the far left. Who is in the middle?", options: ["Alice","Bob","Carol","Dave"], correct: 1 },
  { id: "iq117", section: "cognitive", prompt: "Some athletes are doctors. All doctors are educated. Therefore:", options: ["All athletes are educated","Some athletes are educated","No athlete is educated","All educated people are athletes"], correct: 1 },
  { id: "iq118", section: "cognitive", prompt: "If today is Wednesday, what day was it 100 days ago?", options: ["Monday","Tuesday","Wednesday","Saturday"], correct: 1 },
  { id: "iq119", section: "cognitive", prompt: "A box contains red and blue balls. The probability of picking red is 2/5. If there are 10 red balls, how many blue balls are there?", options: ["10","12","15","20"], correct: 2 },
  { id: "iq120", section: "cognitive", prompt: "If all Zens are Peks, and no Peks are Quels, then:", options: ["Some Zens are Quels","No Zen is a Quel","All Quels are Zens","Some Peks are Zens"], correct: 1 },
  { id: "iq121", section: "cognitive", prompt: "A clock loses 5 minutes per hour. If set correctly at noon, what does it show at 6 PM?", options: ["5:30","5:33","5:45","5:55"], correct: 0 },
  { id: "iq122", section: "cognitive", prompt: "Three boxes are labeled APPLES, ORANGES, and APPLES+ORANGES — all labels are wrong. You pick one fruit from the APPLES+ORANGES box and it is an apple. What does that box actually contain?", options: ["Apples only","Oranges only","Both","Cannot tell"], correct: 0 },
  { id: "iq123", section: "cognitive", prompt: "Jack is twice as old as Jill. In 10 years Jack will be 1.5 times Jill's age. How old is Jill now?", options: ["10","15","20","25"], correct: 2 },
  { id: "iq124", section: "cognitive", prompt: "A shop reduces prices by 20% then increases by 20%. The net change is:", options: ["+4%","0%","-4%","-6%"], correct: 2 },
  { id: "iq125", section: "cognitive", prompt: "If you can read 40 pages per hour, how long to read a 300-page book?", options: ["6 h","7 h 30 min","8 h","8 h 30 min"], correct: 1 },
  { id: "iq126", section: "cognitive", prompt: "A father is 30 years older than his son. In 5 years the father will be 4 times his son's age. How old is the son now?", options: ["5","7","8","10"], correct: 0 },
  { id: "iq127", section: "cognitive", prompt: "Two candles of equal height. One burns out in 4 h, the other in 6 h. When will one be twice the height of the other?", options: ["2 h","3 h","4 h","5 h"], correct: 1 },
  { id: "iq128", section: "cognitive", prompt: "If 6 workers complete a job in 8 days, how many workers are needed to complete it in 4 days?", options: ["10","12","14","16"], correct: 1 },
  { id: "iq129", section: "cognitive", prompt: "A water tank fills in 6 hours and drains in 10 hours. If both are open, how long to fill it?", options: ["12 h","15 h","16 h","18 h"], correct: 1 },
  { id: "iq130", section: "cognitive", prompt: "Maria scores 70, 80, and 90 on three tests. What does she need on the fourth to average 85?", options: ["95","98","100","105"], correct: 2 },
  { id: "iq131", section: "cognitive", prompt: "All red squares are large. This square is not large. Therefore:", options: ["It is red","It is not red","It may or may not be red","It is another colour"], correct: 1 },
  { id: "iq132", section: "cognitive", prompt: "There are 12 balls, one heavier. Using a balance scale, what is the minimum number of weighings needed to always find it?", options: ["2","3","4","5"], correct: 1 },
  { id: "iq133", section: "cognitive", prompt: "If MONDAY = 1, TUESDAY = 2 … SUNDAY = 7, what is WEDNESDAY + FRIDAY?", options: ["7","8","9","10"], correct: 1 },
  { id: "iq134", section: "cognitive", prompt: "A car travels 60 km at 40 km/h then 60 km at 60 km/h. What is the average speed?", options: ["48 km/h","50 km/h","52 km/h","54 km/h"], correct: 0 },
  { id: "iq135", section: "cognitive", prompt: "How many prime numbers are between 10 and 30?", options: ["3","4","5","6"], correct: 2 },
  { id: "iq136", section: "cognitive", prompt: "A square field has perimeter 400 m. What is its area?", options: ["1000 m²","5000 m²","10 000 m²","40 000 m²"], correct: 2 },
  { id: "iq137", section: "cognitive", prompt: "If A = 1, B = 2 … Z = 26, what is the value of CAB?", options: ["6","8","9","12"], correct: 0 },
  { id: "iq138", section: "cognitive", prompt: "In a group of 30, 18 play chess and 16 play tennis. At least how many play both?", options: ["2","4","6","8"], correct: 1 },
  { id: "iq139", section: "cognitive", prompt: "A merchant buys goods at £80 and sells them at £100. The profit percentage is:", options: ["20%","25%","30%","33%"], correct: 1 },
  { id: "iq140", section: "cognitive", prompt: "A rectangle has area 48 m² and length 8 m. What is its perimeter?", options: ["24 m","28 m","32 m","40 m"], correct: 2 },

  // ── Letter/pattern & coded sequences (iq141–iq160) ──
  { id: "iq141", section: "cognitive", prompt: "Next in series: Z, X, V, T, R, ?", options: ["P","O","N","Q"], correct: 0 },
  { id: "iq142", section: "cognitive", prompt: "What comes next: AZ, BY, CX, DW, ?", options: ["EU","EV","FV","FU"], correct: 1 },
  { id: "iq143", section: "cognitive", prompt: "If FRIEND = GSJFOE, what does HOUSE decode to?", options: ["IPVTF","GNRRD","HTXRD","IOVRD"], correct: 0 },
  { id: "iq144", section: "cognitive", prompt: "Complete: B, E, H, K, N, ?", options: ["O","P","Q","R"], correct: 2 },
  { id: "iq145", section: "cognitive", prompt: "Next in series: A1, B3, C6, D10, ?", options: ["E14","E15","F14","F15"], correct: 1 },
  { id: "iq146", section: "cognitive", prompt: "What comes next: AC, CE, EG, GI, ?", options: ["HJ","IJ","IK","JK"], correct: 2 },
  { id: "iq147", section: "cognitive", prompt: "Which letter is the 6th to the right of the 3rd letter from the left in ABCDEFGHIJK?", options: ["H","I","J","K"], correct: 1 },
  { id: "iq148", section: "cognitive", prompt: "Complete: 1A, 2C, 3E, 4G, ?", options: ["5H","5I","6H","6I"], correct: 1 },
  { id: "iq149", section: "cognitive", prompt: "If BLACK = 25311 and WHITE = 23952, what does the digit 3 represent?", options: ["A","L","C","K"], correct: 1 },
  { id: "iq150", section: "cognitive", prompt: "Next in series: M, N, P, S, W, ?", options: ["A","B","C","D"], correct: 1 },
  { id: "iq151", section: "cognitive", prompt: "What letter is missing: B, D, G, K, P, ?", options: ["U","V","W","X"], correct: 1 },
  { id: "iq152", section: "cognitive", prompt: "Which comes next: BA, DC, FE, HG, ?", options: ["IJ","JI","KL","LK"], correct: 1 },
  { id: "iq153", section: "cognitive", prompt: "Next in pattern: 2B, 4D, 6F, 8H, ?", options: ["10I","10J","11J","12J"], correct: 1 },
  { id: "iq154", section: "cognitive", prompt: "Complete: J10, H8, F6, D4, ?", options: ["B1","B2","C2","C3"], correct: 1 },
  { id: "iq155", section: "cognitive", prompt: "What comes next: AAB, ABB, ABC, ABD, ?", options: ["ABE","ACE","BBE","BCE"], correct: 0 },

  // ── Spatial reasoning described (iq156–iq170) ──
  { id: "iq156", section: "cognitive", prompt: "A cube is painted red on all faces then cut into 27 equal small cubes. How many small cubes have exactly 2 red faces?", options: ["8","12","16","20"], correct: 1 },
  { id: "iq157", section: "cognitive", prompt: "A cube is painted and cut into 27 equal cubes. How many have NO painted face?", options: ["0","1","2","4"], correct: 1 },
  { id: "iq158", section: "cognitive", prompt: "A square piece of paper is folded in half twice then a hole is punched through all layers. How many holes appear when unfolded?", options: ["2","4","6","8"], correct: 1 },
  { id: "iq159", section: "cognitive", prompt: "You hold a clock face in front of a mirror. It reads 3:00. What time does the mirror image show?", options: ["9:00","3:00","6:00","12:00"], correct: 0 },
  { id: "iq160", section: "cognitive", prompt: "A rectangular room is 10 m × 8 m. A spider in one corner must crawl to the opposite corner (on ceiling or floor). What is the shortest surface distance?", options: ["13 m","14 m","√260 m","18 m"], correct: 2 },
  { id: "iq161", section: "cognitive", prompt: "Which 3D shape has exactly 5 faces?", options: ["Cube","Triangular prism","Square pyramid","Tetrahedron"], correct: 2 },
  { id: "iq162", section: "cognitive", prompt: "A shape is reflected across the vertical axis, then rotated 90° clockwise. What is the combined transformation?", options: ["Same as a 90° anticlockwise rotation","Same as a reflection across the horizontal axis","A rotation plus a reflection","None of the above"], correct: 1 },
  { id: "iq163", section: "cognitive", prompt: "How many triangles are in a figure that has a large triangle divided into 4 equal smaller triangles?", options: ["4","5","6","7"], correct: 1 },
  { id: "iq164", section: "cognitive", prompt: "A circle is inscribed in a square of side 10 cm. What is the area of the circle?", options: ["25π","50π","75π","100π"], correct: 0 },
  { id: "iq165", section: "cognitive", prompt: "If you rotate the letter N 180°, which letter does it resemble most?", options: ["Z","S","N","H"], correct: 2 },

  // ── Mixed harder problems (iq166–iq190) ──
  { id: "iq166", section: "cognitive", prompt: "A train 200 m long passes a pole in 10 seconds. At what speed is it travelling?", options: ["20 m/s","25 m/s","30 m/s","40 m/s"], correct: 0 },
  { id: "iq167", section: "cognitive", prompt: "The average of 5 consecutive even numbers is 32. What is the largest of the 5?", options: ["34","36","38","40"], correct: 1 },
  { id: "iq168", section: "cognitive", prompt: "In how many ways can 3 books be arranged on a shelf?", options: ["3","6","9","12"], correct: 1 },
  { id: "iq169", section: "cognitive", prompt: "What percentage is 45 of 180?", options: ["20%","25%","30%","35%"], correct: 1 },
  { id: "iq170", section: "cognitive", prompt: "The sum of digits of a two-digit number is 9. When the digits are reversed, the number increases by 27. What is the original number?", options: ["27","36","45","54"], correct: 1 },
  { id: "iq171", section: "cognitive", prompt: "A cyclist travels at 12 km/h for 1 hour, then 18 km/h for 2 hours. What is the total average speed?", options: ["14 km/h","15 km/h","16 km/h","17 km/h"], correct: 2 },
  { id: "iq172", section: "cognitive", prompt: "How many zeros does 25! (25 factorial) end in?", options: ["4","5","6","7"], correct: 2 },
  { id: "iq173", section: "cognitive", prompt: "If 3x + 2 = 17, what is x?", options: ["3","4","5","6"], correct: 2 },
  { id: "iq174", section: "cognitive", prompt: "A man walks north 3 km, east 4 km. How far is he from his starting point?", options: ["4 km","5 km","6 km","7 km"], correct: 1 },
  { id: "iq175", section: "cognitive", prompt: "Which number is both a perfect square and a perfect cube between 1 and 100?", options: ["8","27","64","100"], correct: 2 },
  { id: "iq176", section: "cognitive", prompt: "A bag has 4 red and 6 blue balls. Two are drawn without replacement. What is the probability both are red?", options: ["2/15","4/15","6/45","2/9"], correct: 0 },
  { id: "iq177", section: "cognitive", prompt: "If 2^n = 64, what is n?", options: ["5","6","7","8"], correct: 1 },
  { id: "iq178", section: "cognitive", prompt: "A tank is 1/3 full. After adding 20 litres it is 1/2 full. Capacity of the tank?", options: ["90 L","100 L","110 L","120 L"], correct: 3 },
  { id: "iq179", section: "cognitive", prompt: "A train travels from A to B in 3 hours and returns in 2 hours. What is the average speed for the round trip if each leg is 120 km?", options: ["48 km/h","50 km/h","52 km/h","57.6 km/h"], correct: 0 },
  { id: "iq180", section: "cognitive", prompt: "A rectangle has length twice its width. Its area is 72 m². What is its perimeter?", options: ["24 m","36 m","48 m","54 m"], correct: 1 },
  { id: "iq181", section: "cognitive", prompt: "If you double a number and add 3, you get 19. What is the number?", options: ["6","7","8","9"], correct: 2 },
  { id: "iq182", section: "cognitive", prompt: "What is the next prime number after 89?", options: ["91","93","97","99"], correct: 2 },
  { id: "iq183", section: "cognitive", prompt: "How many diagonals does a hexagon have?", options: ["6","8","9","12"], correct: 2 },
  { id: "iq184", section: "cognitive", prompt: "A class of 30 students has a mean score of 70. A new student with score 100 joins. What is the new mean? (round to 1 dp)", options: ["70.7","71","71.5","72"], correct: 1 },
  { id: "iq185", section: "cognitive", prompt: "Which is the largest: 2/3, 3/4, 5/7, 7/10?", options: ["2/3","3/4","5/7","7/10"], correct: 1 },
  { id: "iq186", section: "cognitive", prompt: "In a right triangle, the two legs are 6 and 8. What is the hypotenuse?", options: ["9","10","11","12"], correct: 1 },
  { id: "iq187", section: "cognitive", prompt: "Sarah is 3 times as old as David. In 12 years she will be twice his age. How old is David now?", options: ["6","12","15","18"], correct: 1 },
  { id: "iq188", section: "cognitive", prompt: "If the hour hand of a clock moves 30° per hour, how many degrees does it move in 40 minutes?", options: ["15°","20°","25°","30°"], correct: 1 },
  { id: "iq189", section: "cognitive", prompt: "A product is discounted 30% then 20%. The total percentage discount is:", options: ["44%","46%","50%","56%"], correct: 0 },
  { id: "iq190", section: "cognitive", prompt: "What is the sum of interior angles of a pentagon?", options: ["360°","450°","540°","720°"], correct: 2 },

  // ── Number sequences & patterns (iq191–iq200) ──
  { id: "iq191", section: "cognitive", prompt: "What comes next: 1, 2, 6, 24, 120, ?", options: ["360","480","720","840"], correct: 2 },
  { id: "iq192", section: "cognitive", prompt: "Find the next: 0, 1, 1, 2, 3, 5, 8, 13, 21, ?", options: ["29","34","36","40"], correct: 1 },
  { id: "iq193", section: "cognitive", prompt: "What continues: 1, 3, 6, 10, 15, 21, 28, ?", options: ["34","36","37","40"], correct: 1 },
  { id: "iq194", section: "cognitive", prompt: "Find the missing number: 4, 9, 16, 25, 36, 49, ?", options: ["56","60","64","72"], correct: 2 },
  { id: "iq195", section: "cognitive", prompt: "What comes next: 2, 5, 10, 17, 26, 37, ?", options: ["48","50","52","54"], correct: 1 },
  { id: "iq196", section: "cognitive", prompt: "Complete: 512, 256, 128, 64, 32, ?", options: ["12","16","20","24"], correct: 1 },
  { id: "iq197", section: "cognitive", prompt: "What comes next: 1, 2, 4, 7, 11, 16, 22, ?", options: ["28","29","30","32"], correct: 1 },
  { id: "iq198", section: "cognitive", prompt: "Find the next: 2, 6, 12, 20, 30, 42, ?", options: ["52","54","56","60"], correct: 2 },
  { id: "iq199", section: "cognitive", prompt: "What replaces ?: 3, 7, 13, 21, 31, 43, ?", options: ["55","57","58","60"], correct: 1 },
  { id: "iq200", section: "cognitive", prompt: "What comes next: 2, 3, 6, 11, 20, 37, ?", options: ["66","68","70","74"], correct: 1 },

  // ── Verbal reasoning (iq201–iq210) ──
  { id: "iq201", section: "cognitive", prompt: "Which word is the odd one out: Anxious, Worried, Concerned, Elated, Apprehensive?", options: ["Anxious","Worried","Elated","Apprehensive"], correct: 2 },
  { id: "iq202", section: "cognitive", prompt: "Melody is to Song as Chapter is to:", options: ["Page","Book","Paragraph","Author"], correct: 1 },
  { id: "iq203", section: "cognitive", prompt: "Which word means the same as FRUGAL?", options: ["Generous","Extravagant","Economical","Wasteful"], correct: 2 },
  { id: "iq204", section: "cognitive", prompt: "Which word is OPPOSITE to EPHEMERAL?", options: ["Brief","Fleeting","Enduring","Temporary"], correct: 2 },
  { id: "iq205", section: "cognitive", prompt: "Which word is the odd one out: Copper, Gold, Tin, Steel, Silver?", options: ["Copper","Gold","Steel","Silver"], correct: 2 },
  { id: "iq206", section: "cognitive", prompt: "Which word means the same as LACONIC?", options: ["Verbose","Talkative","Concise","Eloquent"], correct: 2 },
  { id: "iq207", section: "cognitive", prompt: "Sceptical is to Credulous as Generous is to:", options: ["Kind","Stingy","Charitable","Giving"], correct: 1 },
  { id: "iq208", section: "cognitive", prompt: "Which word is the odd one out: Basil, Oregano, Thyme, Ginger, Rosemary?", options: ["Basil","Oregano","Ginger","Rosemary"], correct: 2 },
  { id: "iq209", section: "cognitive", prompt: "Which word means the OPPOSITE of BELLIGERENT?", options: ["Aggressive","Hostile","Peaceful","Combative"], correct: 2 },
  { id: "iq210", section: "cognitive", prompt: "Library is to Books as Vineyard is to:", options: ["Wine","Grapes","Bottles","Barrels"], correct: 1 },

  // ── Logic & deduction (iq211–iq220) ──
  { id: "iq211", section: "cognitive", prompt: "Alex is older than Ben. Charlie is younger than Alex. Ben is older than Charlie. Who is the oldest?", options: ["Alex","Ben","Charlie","Cannot determine"], correct: 0 },
  { id: "iq212", section: "cognitive", prompt: "If no A are B and some C are B, which must be true?", options: ["Some C are A","No C is A","Some B are A","No A is C"], correct: 3 },
  { id: "iq213", section: "cognitive", prompt: "All athletes train daily. Sam does not train daily. Therefore:", options: ["Sam is not an athlete","Sam might be an athlete","Sam trains occasionally","All non-athletes are like Sam"], correct: 0 },
  { id: "iq214", section: "cognitive", prompt: "The median of 8, 12, 14, 40, 42 is:", options: ["12","13","14","15"], correct: 2 },
  { id: "iq215", section: "cognitive", prompt: "If A implies B, and B implies C, and C is false, what can you conclude?", options: ["A is true","B is true","A is false","Nothing about A"], correct: 2 },
  { id: "iq216", section: "cognitive", prompt: "Emma scored 45 out of 60. What percentage did she score?", options: ["70%","72%","75%","80%"], correct: 2 },
  { id: "iq217", section: "cognitive", prompt: "A car uses 8 litres per 100 km. How many litres does it use to travel 350 km?", options: ["24","28","30","32"], correct: 1 },
  { id: "iq218", section: "cognitive", prompt: "Six friends split a restaurant bill of £150 equally. How much does each person pay?", options: ["£22","£24","£25","£30"], correct: 2 },
  { id: "iq219", section: "cognitive", prompt: "If 3 cats catch 3 mice in 3 minutes, how many cats are needed to catch 9 mice in 9 minutes?", options: ["1","2","3","9"], correct: 2 },
  { id: "iq220", section: "cognitive", prompt: "A bag holds 12 items. After removing 25%, then removing 1/3 of what remains, how many items are left?", options: ["5","6","7","8"], correct: 1 },

  // ── Spatial & geometric reasoning (iq221–iq230) ──
  { id: "iq221", section: "cognitive", prompt: "A cube has side length 3 cm. What is its total surface area?", options: ["27 cm²","36 cm²","54 cm²","81 cm²"], correct: 2 },
  { id: "iq222", section: "cognitive", prompt: "A piece of paper is folded in half 3 times. How many layers does it have?", options: ["6","8","9","12"], correct: 1 },
  { id: "iq223", section: "cognitive", prompt: "A right triangle has legs of length 5 and 12. What is its hypotenuse?", options: ["11","13","14","15"], correct: 1 },
  { id: "iq224", section: "cognitive", prompt: "How many edges does a cube have?", options: ["6","8","10","12"], correct: 3 },
  { id: "iq225", section: "cognitive", prompt: "A circle's radius is doubled. By what factor does its area increase?", options: ["2","4","6","8"], correct: 1 },
  { id: "iq226", section: "cognitive", prompt: "A cone and a cylinder share the same base and height. The cone's volume is what fraction of the cylinder's?", options: ["1/2","1/3","1/4","2/3"], correct: 1 },
  { id: "iq227", section: "cognitive", prompt: "A rectangle has a diagonal of 10 and one side of 6. What is the area of the rectangle?", options: ["40","48","60","80"], correct: 1 },
  { id: "iq228", section: "cognitive", prompt: "An angle measures 40°. What is its supplement?", options: ["50°","140°","150°","180°"], correct: 1 },
  { id: "iq229", section: "cognitive", prompt: "What is the area of a triangle with base 10 and height 7?", options: ["35","40","50","70"], correct: 0 },
  { id: "iq230", section: "cognitive", prompt: "A 3×3×3 cube made of unit cubes is painted on all outer faces. How many unit cubes have exactly 1 painted face?", options: ["6","12","18","24"], correct: 0 },

  // ── Advanced & mixed hard problems (iq231–iq250) ──
  { id: "iq231", section: "cognitive", prompt: "What comes next in the Look-and-Say sequence: 1, 11, 21, 1211, 111221, ?", options: ["312211","312111","211321","123111"], correct: 0 },
  { id: "iq232", section: "cognitive", prompt: "Alice completes a task in 6 hours; Bob in 4 hours. Working together, how long do they take?", options: ["2 h","2 h 20 min","2 h 24 min","3 h"], correct: 2 },
  { id: "iq233", section: "cognitive", prompt: "A 4-digit password uses digits 0–9 with no repeats. How many such passwords are possible?", options: ["5040","3024","10000","9000"], correct: 0 },
  { id: "iq234", section: "cognitive", prompt: "How many ways can you make exactly 50p using only 10p and 20p coins?", options: ["2","3","4","5"], correct: 1 },
  { id: "iq235", section: "cognitive", prompt: "What is the units digit of 7^50?", options: ["1","3","7","9"], correct: 3 },
  { id: "iq236", section: "cognitive", prompt: "A bag has 3 red and 5 blue marbles. Two are drawn without replacement. What is the probability both are blue?", options: ["5/14","5/16","25/64","2/9"], correct: 0 },
  { id: "iq237", section: "cognitive", prompt: "The sum of three consecutive odd numbers is 51. What is the largest?", options: ["15","17","19","21"], correct: 2 },
  { id: "iq238", section: "cognitive", prompt: "If log₂(x) = 5, what is x?", options: ["10","16","32","64"], correct: 2 },
  { id: "iq239", section: "cognitive", prompt: "How many ways can 4 people be arranged in a line?", options: ["12","16","24","32"], correct: 2 },
  { id: "iq240", section: "cognitive", prompt: "Which set of angles can form a valid triangle?", options: ["60°, 70°, 80°","90°, 90°, 90°","45°, 45°, 90°","100°, 120°, 40°"], correct: 2 },
  { id: "iq241", section: "cognitive", prompt: "A shopkeeper marks a price 25% above cost then gives a 20% discount. The net profit or loss is:", options: ["0% (break even)","5% profit","5% loss","2% loss"], correct: 0 },
  { id: "iq242", section: "cognitive", prompt: "How many different 3-letter arrangements can be made from A, B, C, D (no letter repeated)?", options: ["12","24","36","48"], correct: 1 },
  { id: "iq243", section: "cognitive", prompt: "A square pyramid has a square base with 4 triangular faces. How many edges does it have?", options: ["6","8","10","12"], correct: 1 },
  { id: "iq244", section: "cognitive", prompt: "What is 20% of 20% of 500?", options: ["10","15","20","25"], correct: 2 },
  { id: "iq245", section: "cognitive", prompt: "Pipes A and B fill a pool: A in 10 hours, B in 15 hours. Together, how long to fill it?", options: ["4 h","5 h","6 h","7 h"], correct: 2 },
  { id: "iq246", section: "cognitive", prompt: "Three dice are rolled. What is the probability all three show the same number?", options: ["1/36","1/12","1/6","1/216"], correct: 0 },
  { id: "iq247", section: "cognitive", prompt: "If sin(30°) = 0.5, what is sin(150°)?", options: ["−0.5","0","0.5","1"], correct: 2 },
  { id: "iq248", section: "cognitive", prompt: "A cylinder has radius 3 cm and height 10 cm. What is its volume?", options: ["90π cm³","100π cm³","60π cm³","120π cm³"], correct: 0 },
  { id: "iq249", section: "cognitive", prompt: "A 4×4×4 cube is made of unit cubes and painted on all outer faces. How many unit cubes have NO painted face?", options: ["4","8","16","24"], correct: 1 },
  { id: "iq250", section: "cognitive", prompt: "If you invest £1000 at 10% compound interest per year, what is the value after 2 years?", options: ["£1100","£1200","£1210","£1220"], correct: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTEREST BANK  (projective / symbolic)
// Each question shows abstract choices — shapes, animals, lines, colours,
// scenes — and never names a career. Every option carries a hidden RIASEC
// (Holland) vector; the engine (career-engine.ts) aggregates the chosen vectors
// and infers concrete field interests. The session picker draws 9 per attempt,
// diversified across themes so no two sittings feel alike.
// RIASEC: R Realistic · I Investigative · A Artistic · S Social · E Enterprising · C Conventional
// ─────────────────────────────────────────────────────────────────────────────
export const INTEREST_BANK: InterestQ[] = [
  {
    id: "ins1", section: "interest", theme: "shape", select: "one",
    prompt: "Which shape are you instinctively drawn to?",
    options: [
      { id: "s1_square",    label: "Square",    visual: { kind: "shape", shape: "square" },    riasec: { C: 3, R: 1 } },
      { id: "s1_triangle",  label: "Triangle",  visual: { kind: "shape", shape: "triangle" },  riasec: { E: 3 } },
      { id: "s1_circle",    label: "Circle",    visual: { kind: "shape", shape: "circle" },    riasec: { S: 3 } },
      { id: "s1_squiggle",  label: "Squiggle",  visual: { kind: "shape", shape: "squiggle" },  riasec: { A: 3 } },
      { id: "s1_rectangle", label: "Rectangle", visual: { kind: "shape", shape: "rectangle" }, riasec: { I: 2, S: 1 } },
      { id: "s1_diamond",   label: "Diamond",   visual: { kind: "shape", shape: "diamond" },   riasec: { E: 1, C: 2 } },
    ],
  },
  {
    id: "ina1", section: "interest", theme: "animal", select: "one",
    prompt: "Which creature feels most like you?",
    options: [
      { id: "a1_lion",    label: "Lion",    visual: { kind: "emoji", emoji: "🦁" }, riasec: { E: 3, R: 1 } },
      { id: "a1_owl",     label: "Owl",     visual: { kind: "emoji", emoji: "🦉" }, riasec: { I: 3 } },
      { id: "a1_dolphin", label: "Dolphin", visual: { kind: "emoji", emoji: "🐬" }, riasec: { S: 3, A: 1 } },
      { id: "a1_eagle",   label: "Eagle",   visual: { kind: "emoji", emoji: "🦅" }, riasec: { E: 2, I: 2 } },
      { id: "a1_fox",     label: "Fox",     visual: { kind: "emoji", emoji: "🦊" }, riasec: { A: 2, E: 2 } },
      { id: "a1_wolf",    label: "Wolf",    visual: { kind: "emoji", emoji: "🐺" }, riasec: { R: 2, S: 2 } },
    ],
  },
  {
    id: "inl1", section: "interest", theme: "line", select: "one",
    prompt: "Which line feels the most 'you'?",
    options: [
      { id: "l1_straight", label: "Straight",   visual: { kind: "line", line: "straight" }, riasec: { C: 3 } },
      { id: "l1_diagonal", label: "Rising",     visual: { kind: "line", line: "diagonal" }, riasec: { E: 3 } },
      { id: "l1_wave",     label: "Wave",       visual: { kind: "line", line: "wave" },     riasec: { A: 3 } },
      { id: "l1_zigzag",   label: "Zig-zag",    visual: { kind: "line", line: "zigzag" },   riasec: { E: 2, R: 1 } },
      { id: "l1_spiral",   label: "Spiral",     visual: { kind: "line", line: "spiral" },   riasec: { I: 3 } },
      { id: "l1_grid",     label: "Grid",       visual: { kind: "line", line: "grid" },     riasec: { I: 2, C: 2 } },
    ],
  },
  {
    id: "inc1", section: "interest", theme: "color", select: "one",
    prompt: "Which palette pulls you in?",
    options: [
      { id: "c1_ember",  label: "Ember",    visual: { kind: "swatch", colors: ["#ff6a3d", "#e11d48"] }, riasec: { E: 3 } },
      { id: "c1_deep",   label: "Deep sea", visual: { kind: "swatch", colors: ["#1e3a8a", "#0891b2"] }, riasec: { I: 3 } },
      { id: "c1_fresh",  label: "Meadow",   visual: { kind: "swatch", colors: ["#16a34a", "#84cc16"] }, riasec: { R: 2, S: 1 } },
      { id: "c1_violet", label: "Violet",   visual: { kind: "swatch", colors: ["#7c3aed", "#c026d3"] }, riasec: { A: 3 } },
      { id: "c1_sunny",  label: "Sunlit",   visual: { kind: "swatch", colors: ["#f59e0b", "#fde047"] }, riasec: { S: 3 } },
      { id: "c1_earth",  label: "Earthen",  visual: { kind: "swatch", colors: ["#78350f", "#a16207"] }, riasec: { R: 2, C: 1 } },
    ],
  },
  {
    id: "inn1", section: "interest", theme: "landscape", select: "one",
    prompt: "Where would you rather be right now?",
    options: [
      { id: "n1_mountain", label: "Mountain peak", visual: { kind: "emoji", emoji: "🏔️" }, riasec: { E: 2, R: 2 } },
      { id: "n1_ocean",    label: "Open ocean",    visual: { kind: "emoji", emoji: "🌊" }, riasec: { I: 2, A: 2 } },
      { id: "n1_forest",   label: "Deep forest",   visual: { kind: "emoji", emoji: "🌲" }, riasec: { R: 2, I: 1, S: 1 } },
      { id: "n1_city",     label: "City lights",   visual: { kind: "emoji", emoji: "🏙️" }, riasec: { E: 2, C: 1 } },
      { id: "n1_meadow",   label: "Golden field",  visual: { kind: "emoji", emoji: "🌾" }, riasec: { S: 2, A: 1 } },
      { id: "n1_desert",   label: "Quiet desert",  visual: { kind: "emoji", emoji: "🏜️" }, riasec: { I: 2, R: 1 } },
    ],
  },
  {
    id: "inp1", section: "interest", theme: "pattern", select: "one",
    prompt: "Which pattern catches your eye?",
    options: [
      { id: "p1_dots",      label: "Ordered dots",  visual: { kind: "pattern", pattern: "dots" },      riasec: { C: 2, I: 1 } },
      { id: "p1_geometric", label: "Geometric",     visual: { kind: "pattern", pattern: "geometric" }, riasec: { I: 2, C: 1 } },
      { id: "p1_organic",   label: "Organic flow",  visual: { kind: "pattern", pattern: "organic" },   riasec: { A: 2, S: 1 } },
      { id: "p1_circuit",   label: "Circuitry",     visual: { kind: "pattern", pattern: "circuit" },   riasec: { I: 2, R: 1 } },
      { id: "p1_marble",    label: "Marble veins",  visual: { kind: "pattern", pattern: "marble" },    riasec: { A: 2, R: 1 } },
      { id: "p1_doodle",    label: "Free doodle",   visual: { kind: "pattern", pattern: "doodle" },    riasec: { A: 3 } },
    ],
  },
  {
    id: "ine1", section: "interest", theme: "element", select: "one",
    prompt: "Which element speaks to you?",
    options: [
      { id: "e1_fire",      label: "Fire",      visual: { kind: "emoji", emoji: "🔥" }, riasec: { E: 3 } },
      { id: "e1_water",     label: "Water",     visual: { kind: "emoji", emoji: "💧" }, riasec: { S: 2, A: 1 } },
      { id: "e1_earth",     label: "Earth",     visual: { kind: "emoji", emoji: "🌍" }, riasec: { R: 2, C: 1 } },
      { id: "e1_air",       label: "Air",       visual: { kind: "emoji", emoji: "🌬️" }, riasec: { A: 2, I: 1 } },
      { id: "e1_lightning", label: "Lightning", visual: { kind: "emoji", emoji: "⚡" }, riasec: { E: 2, I: 1 } },
      { id: "e1_crystal",   label: "Crystal",   visual: { kind: "emoji", emoji: "💎" }, riasec: { C: 2, I: 1 } },
    ],
  },
  {
    id: "ino1", section: "interest", theme: "object", select: "one",
    prompt: "Pick the one object you'd instinctively reach for.",
    options: [
      { id: "o1_compass",   label: "Compass",     visual: { kind: "emoji", emoji: "🧭" }, riasec: { E: 2, R: 1 } },
      { id: "o1_book",      label: "Book",        visual: { kind: "emoji", emoji: "📖" }, riasec: { I: 3 } },
      { id: "o1_brush",     label: "Paintbrush",  visual: { kind: "emoji", emoji: "🎨" }, riasec: { A: 3 } },
      { id: "o1_magnifier", label: "Magnifier",   visual: { kind: "emoji", emoji: "🔍" }, riasec: { I: 3 } },
      { id: "o1_megaphone", label: "Megaphone",   visual: { kind: "emoji", emoji: "📣" }, riasec: { E: 2, S: 1 } },
      { id: "o1_wrench",    label: "Wrench",      visual: { kind: "emoji", emoji: "🔧" }, riasec: { R: 3 } },
    ],
  },
  {
    id: "ind1", section: "interest", theme: "sound", select: "one",
    prompt: "Which sound moves you the most?",
    options: [
      { id: "d1_drum",   label: "Steady drum",  visual: { kind: "emoji", emoji: "🥁" }, riasec: { C: 2, R: 1 } },
      { id: "d1_sax",    label: "Jazz sax",     visual: { kind: "emoji", emoji: "🎷" }, riasec: { A: 3 } },
      { id: "d1_violin", label: "Violin",       visual: { kind: "emoji", emoji: "🎻" }, riasec: { S: 2, A: 1 } },
      { id: "d1_synth",  label: "Electronic",   visual: { kind: "emoji", emoji: "🎧" }, riasec: { I: 2, A: 1 } },
      { id: "d1_guitar", label: "Electric guitar", visual: { kind: "emoji", emoji: "🎸" }, riasec: { E: 2, A: 1 } },
    ],
  },
  {
    id: "ins2", section: "interest", theme: "shape", select: "one",
    prompt: "Which mark would you sign your name with?",
    options: [
      { id: "s2_star",      label: "Star",       visual: { kind: "shape", shape: "star" },      riasec: { E: 2, A: 1 } },
      { id: "s2_hexagon",   label: "Hexagon",    visual: { kind: "shape", shape: "hexagon" },   riasec: { I: 2, R: 1 } },
      { id: "s2_circle",    label: "Circle",     visual: { kind: "shape", shape: "circle" },    riasec: { S: 3 } },
      { id: "s2_square",    label: "Square",     visual: { kind: "shape", shape: "square" },    riasec: { C: 3 } },
      { id: "s2_diamond",   label: "Diamond",    visual: { kind: "shape", shape: "diamond" },   riasec: { E: 1, C: 2 } },
      { id: "s2_squiggle",  label: "Squiggle",   visual: { kind: "shape", shape: "squiggle" },  riasec: { A: 3 } },
    ],
  },
  {
    id: "ina2", section: "interest", theme: "animal", select: "one",
    prompt: "Which animal could you watch for hours?",
    options: [
      { id: "a2_bee",       label: "Bee",       visual: { kind: "emoji", emoji: "🐝" }, riasec: { C: 2, R: 1 } },
      { id: "a2_turtle",    label: "Turtle",    visual: { kind: "emoji", emoji: "🐢" }, riasec: { C: 1, R: 1, I: 1 } },
      { id: "a2_butterfly", label: "Butterfly", visual: { kind: "emoji", emoji: "🦋" }, riasec: { A: 2, S: 1 } },
      { id: "a2_elephant",  label: "Elephant",  visual: { kind: "emoji", emoji: "🐘" }, riasec: { S: 2, C: 1 } },
      { id: "a2_horse",     label: "Horse",     visual: { kind: "emoji", emoji: "🐎" }, riasec: { R: 2, E: 1 } },
      { id: "a2_octopus",   label: "Octopus",   visual: { kind: "emoji", emoji: "🐙" }, riasec: { I: 2, A: 1 } },
    ],
  },
  {
    id: "inl2", section: "interest", theme: "line", select: "one",
    prompt: "Trace the path that feels natural.",
    options: [
      { id: "l2_straight", label: "Two rails",    visual: { kind: "line", line: "straight" }, riasec: { C: 2, R: 1 } },
      { id: "l2_diagonal", label: "Climbing",     visual: { kind: "line", line: "diagonal" }, riasec: { E: 2, C: 1 } },
      { id: "l2_wave",     label: "Ribbon",       visual: { kind: "line", line: "wave" },     riasec: { A: 3 } },
      { id: "l2_zigzag",   label: "Sharp turns",  visual: { kind: "line", line: "zigzag" },   riasec: { E: 2, R: 1 } },
      { id: "l2_spiral",   label: "Inward loop",  visual: { kind: "line", line: "spiral" },   riasec: { I: 3 } },
      { id: "l2_grid",     label: "Network",      visual: { kind: "line", line: "grid" },     riasec: { I: 1, E: 1, C: 1 } },
    ],
  },
  {
    id: "inc2", section: "interest", theme: "color", select: "one",
    prompt: "Which quality of light draws you?",
    options: [
      { id: "c2_neon",  label: "Neon",       visual: { kind: "swatch", colors: ["#22d3ee", "#a855f7"] }, riasec: { E: 2, A: 1 } },
      { id: "c2_pastel",label: "Pastel",     visual: { kind: "swatch", colors: ["#fbcfe8", "#bfdbfe"] }, riasec: { S: 2, A: 1 } },
      { id: "c2_mono",  label: "Monochrome", visual: { kind: "swatch", colors: ["#475569", "#cbd5e1"] }, riasec: { C: 2, I: 1 } },
      { id: "c2_teal",  label: "Forest teal",visual: { kind: "swatch", colors: ["#0f766e", "#4d7c0f"] }, riasec: { R: 2, S: 1 } },
      { id: "c2_gold",  label: "Amber gold", visual: { kind: "swatch", colors: ["#b45309", "#facc15"] }, riasec: { E: 2, C: 1 } },
      { id: "c2_indigo",label: "Indigo",     visual: { kind: "swatch", colors: ["#3730a3", "#6d28d9"] }, riasec: { I: 2, A: 1 } },
    ],
  },
  {
    id: "inn2", section: "interest", theme: "landscape", select: "one",
    prompt: "Your ideal window view would be...",
    options: [
      { id: "n2_stars",   label: "Starry sky",     visual: { kind: "emoji", emoji: "🌌" }, riasec: { I: 2, A: 1 } },
      { id: "n2_farm",    label: "Rolling farmland",visual: { kind: "emoji", emoji: "🚜" }, riasec: { R: 2, C: 1 } },
      { id: "n2_harbor",  label: "Busy harbour",   visual: { kind: "emoji", emoji: "⚓" }, riasec: { E: 2, R: 1 } },
      { id: "n2_loft",    label: "Art-filled loft",visual: { kind: "emoji", emoji: "🖼️" }, riasec: { A: 3 } },
      { id: "n2_trail",   label: "Mountain trail",  visual: { kind: "emoji", emoji: "🥾" }, riasec: { R: 2, E: 1 } },
      { id: "n2_library", label: "Quiet library",  visual: { kind: "emoji", emoji: "📚" }, riasec: { I: 2, S: 1 } },
    ],
  },
  {
    id: "ino2", section: "interest", theme: "object", select: "one",
    prompt: "One tool for a whole year — which do you keep?",
    options: [
      { id: "o2_telescope", label: "Telescope", visual: { kind: "emoji", emoji: "🔭" }, riasec: { I: 3 } },
      { id: "o2_camera",    label: "Camera",    visual: { kind: "emoji", emoji: "📷" }, riasec: { A: 2, I: 1 } },
      { id: "o2_toolbox",   label: "Toolbox",   visual: { kind: "emoji", emoji: "🧰" }, riasec: { R: 3 } },
      { id: "o2_abacus",    label: "Abacus",    visual: { kind: "emoji", emoji: "🧮" }, riasec: { C: 3 } },
      { id: "o2_mic",       label: "Microphone",visual: { kind: "emoji", emoji: "🎤" }, riasec: { E: 2, S: 1 } },
      { id: "o2_map",       label: "Map",       visual: { kind: "emoji", emoji: "🗺️" }, riasec: { I: 1, E: 1, R: 1 } },
    ],
  },
  {
    id: "ing1", section: "interest", theme: "games", select: "one",
    prompt: "Which game would you happily play all night?",
    options: [
      { id: "g1_chess",  label: "Chess",         visual: { kind: "emoji", emoji: "♟️" }, riasec: { I: 2, E: 1 } },
      { id: "g1_jigsaw", label: "Jigsaw puzzle", visual: { kind: "emoji", emoji: "🧩" }, riasec: { C: 2, I: 1 } },
      { id: "g1_improv", label: "Improv / charades", visual: { kind: "emoji", emoji: "🎭" }, riasec: { A: 2, S: 1 } },
      { id: "g1_relay",  label: "Team relay",    visual: { kind: "emoji", emoji: "🏃" }, riasec: { R: 2, S: 1 } },
      { id: "g1_cards",  label: "Card bluffing", visual: { kind: "emoji", emoji: "🃏" }, riasec: { E: 2, C: 1 } },
      { id: "g1_blocks", label: "Building blocks", visual: { kind: "emoji", emoji: "🧱" }, riasec: { R: 2, A: 1 } },
    ],
  },
  {
    id: "inm1", section: "interest", theme: "material", select: "one",
    prompt: "Which material would you shape with your hands?",
    options: [
      { id: "m1_clay",   label: "Clay",   visual: { kind: "emoji", emoji: "🏺" }, riasec: { A: 2, R: 1 } },
      { id: "m1_steel",  label: "Steel",  visual: { kind: "emoji", emoji: "🔩" }, riasec: { R: 2, E: 1 } },
      { id: "m1_glass",  label: "Glass",  visual: { kind: "emoji", emoji: "🧊" }, riasec: { A: 1, C: 1, I: 1 } },
      { id: "m1_wood",   label: "Wood",   visual: { kind: "emoji", emoji: "🪵" }, riasec: { R: 2, C: 1 } },
      { id: "m1_fabric", label: "Fabric", visual: { kind: "emoji", emoji: "🧶" }, riasec: { A: 2, S: 1 } },
      { id: "m1_stone",  label: "Stone",  visual: { kind: "emoji", emoji: "🪨" }, riasec: { R: 2, I: 1 } },
    ],
  },
  {
    id: "inv1", section: "interest", theme: "motion", select: "one",
    prompt: "Which motion best describes you?",
    options: [
      { id: "v1_sprint", label: "A sprint",     visual: { kind: "emoji", emoji: "🏁" }, riasec: { E: 2, R: 1 } },
      { id: "v1_climb",  label: "A slow climb", visual: { kind: "emoji", emoji: "🧗" }, riasec: { R: 2, E: 1 } },
      { id: "v1_dance",  label: "A dance",      visual: { kind: "emoji", emoji: "💃" }, riasec: { A: 2, S: 1 } },
      { id: "v1_dive",   label: "A deep dive",  visual: { kind: "emoji", emoji: "🤿" }, riasec: { I: 3 } },
      { id: "v1_march",  label: "A steady march", visual: { kind: "emoji", emoji: "🥾" }, riasec: { C: 2, R: 1 } },
      { id: "v1_glide",  label: "A free glide", visual: { kind: "emoji", emoji: "🪂" }, riasec: { A: 1, E: 1, I: 1 } },
    ],
  },
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
  // Personality: 12 questions with guaranteed 3 per axis (EI, SN, TF, JP)
  // 3 per axis = 12 fixed slots — no random padding needed
  const axes = ["EI", "SN", "TF", "JP"] as const;
  const byAxis = Object.fromEntries(
    axes.map((ax) => [ax, shuffle(PERSONALITY_BANK.filter((q) => q.axis === ax))])
  ) as Record<typeof axes[number], PersonalityQ[]>;

  const personality: PersonalityQ[] = [];
  for (const ax of axes) personality.push(byAxis[ax][0], byAxis[ax][1], byAxis[ax][2]);

  return {
    personality: shuffle(personality),
    iq: shuffle(IQ_BANK).slice(0, 9),
    interest: pickInterestQuestions(9),
  };
}

// Interest picker: draw 9 projective questions, spread across themes so a
// sitting doesn't stack several shape (or animal) questions in a row. We take
// one question per theme in random theme order first, then top up if short.
function pickInterestQuestions(n: number): InterestQ[] {
  const byTheme = new Map<string, InterestQ[]>();
  for (const q of shuffle(INTEREST_BANK)) {
    const list = byTheme.get(q.theme) ?? [];
    list.push(q);
    byTheme.set(q.theme, list);
  }
  const buckets = shuffle([...byTheme.values()]);
  const picked: InterestQ[] = [];
  // Round-robin across themes until we have n (or run out).
  let round = 0;
  while (picked.length < n && buckets.some((b) => b.length > round)) {
    for (const b of buckets) {
      if (b.length > round) picked.push(b[round]);
      if (picked.length >= n) break;
    }
    round++;
  }
  return picked.slice(0, n);
}

// Server-side helper: look up correct answer index for an IQ question by id
export function getIQCorrect(id: string): number | null {
  return IQ_BANK.find((q) => q.id === id)?.correct ?? null;
}

// Server-authoritative resolver: given an interest option id (what the client
// submits), return its hidden RIASEC vector. The mapping lives on the server so
// the client can't inflate or fabricate orientation weights.
const INTEREST_OPTION_RIASEC: Map<string, Partial<Record<RiasecDim, number>>> = (() => {
  const m = new Map<string, Partial<Record<RiasecDim, number>>>();
  for (const q of INTEREST_BANK) for (const o of q.options) m.set(o.id, o.riasec);
  return m;
})();

export function getInterestRiasec(optionId: string): Partial<Record<RiasecDim, number>> | null {
  return INTEREST_OPTION_RIASEC.get(optionId) ?? null;
}
