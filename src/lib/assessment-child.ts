// Child (8-12) assessment — 20 gamified questions across 5 dimensions.
// Designed to feel playful but not babyish. No specific career recommendations:
// results map to strength badges + future directions.

export type ChildTrait =
  | "curiosity"
  | "creativity"
  | "teamwork"
  | "leadership"
  | "communication"
  | "problemSolving"
  | "logic";

export type ChildQuestion = {
  id: string;
  emoji: string;
  prompt: string;
  options: { label: string; emoji?: string; traits: Partial<Record<ChildTrait, number>> }[];
};

const t = (o: Partial<Record<ChildTrait, number>>) => o;

export const childQuestions: ChildQuestion[] = [
  {
    id: "c1", emoji: "🎨", prompt: "When you have free time, you love to…",
    options: [
      { label: "Draw, build or invent things", emoji: "🎨", traits: t({ creativity: 3, curiosity: 1 }) },
      { label: "Read or watch how things work", emoji: "📚", traits: t({ curiosity: 3, logic: 1 }) },
      { label: "Play with friends", emoji: "🤝", traits: t({ teamwork: 3, communication: 1 }) },
      { label: "Make up new games and rules", emoji: "🎲", traits: t({ leadership: 2, creativity: 2 }) },
    ],
  },
  {
    id: "c2", emoji: "🧩", prompt: "Your friend can't solve a puzzle. You…",
    options: [
      { label: "Try every piece until it fits", traits: t({ problemSolving: 3, logic: 1 }) },
      { label: "Cheer them on and help", traits: t({ communication: 2, teamwork: 2 }) },
      { label: "Show them a clever trick", traits: t({ logic: 2, leadership: 2 }) },
      { label: "Draw a picture of the answer", traits: t({ creativity: 3 }) },
    ],
  },
  {
    id: "c3", emoji: "🚀", prompt: "If you had a magic spaceship, you'd…",
    options: [
      { label: "Explore unknown planets", traits: t({ curiosity: 3 }) },
      { label: "Invite the whole class on board", traits: t({ teamwork: 2, communication: 2 }) },
      { label: "Be the captain leading the trip", traits: t({ leadership: 3 }) },
      { label: "Design every room inside it", traits: t({ creativity: 3 }) },
    ],
  },
  {
    id: "c4", emoji: "🦸", prompt: "Your superpower would be…",
    options: [
      { label: "Super smart brain", traits: t({ logic: 3, problemSolving: 1 }) },
      { label: "Talk to anyone, anywhere", traits: t({ communication: 3 }) },
      { label: "Create anything I imagine", traits: t({ creativity: 3 }) },
      { label: "Make friends feel happy", traits: t({ teamwork: 2, communication: 1 }) },
    ],
  },
  {
    id: "c5", emoji: "🧠", prompt: "Which pattern comes next? 🔺 🔵 🔺 🔵 🔺 ?",
    options: [
      { label: "🔵", traits: t({ logic: 3 }) },
      { label: "🔺", traits: t({ logic: 1 }) },
      { label: "⭐", traits: t({ creativity: 1 }) },
      { label: "I'd invent a new shape", traits: t({ creativity: 3, curiosity: 1 }) },
    ],
  },
  {
    id: "c6", emoji: "🎤", prompt: "On stage in front of your class…",
    options: [
      { label: "Love it! I'd tell jokes", traits: t({ communication: 3, leadership: 1 }) },
      { label: "Confident with practice", traits: t({ communication: 2 }) },
      { label: "Nervous but I'd try", traits: t({ teamwork: 1 }) },
      { label: "I'd help backstage instead", traits: t({ teamwork: 3 }) },
    ],
  },
  {
    id: "c7", emoji: "🧩", prompt: "Find the missing number: 2, 4, 6, 8, ?",
    options: [
      { label: "9", traits: {} },
      { label: "10", traits: t({ logic: 3 }) },
      { label: "12", traits: t({ logic: 1 }) },
      { label: "I'd use a calculator", traits: {} },
    ],
  },
  {
    id: "c8", emoji: "🎯", prompt: "Your group project has a problem. You…",
    options: [
      { label: "Take charge and make a plan", traits: t({ leadership: 3 }) },
      { label: "Listen and find a clever fix", traits: t({ problemSolving: 3 }) },
      { label: "Make sure everyone agrees", traits: t({ teamwork: 3, communication: 1 }) },
      { label: "Try a totally new idea", traits: t({ creativity: 3 }) },
    ],
  },
  {
    id: "c9", emoji: "🔍", prompt: "You see a beetle in the garden. You…",
    options: [
      { label: "Watch how it moves", traits: t({ curiosity: 3 }) },
      { label: "Look it up in a book", traits: t({ curiosity: 2, logic: 1 }) },
      { label: "Draw it", traits: t({ creativity: 3 }) },
      { label: "Show your friends", traits: t({ communication: 2, teamwork: 1 }) },
    ],
  },
  {
    id: "c10", emoji: "📖", prompt: "Your favorite kind of story is…",
    options: [
      { label: "Mysteries to solve", traits: t({ problemSolving: 3, logic: 1 }) },
      { label: "Adventures in new places", traits: t({ curiosity: 3 }) },
      { label: "Heroes who help others", traits: t({ leadership: 2, communication: 1 }) },
      { label: "Funny stories with friends", traits: t({ teamwork: 2, communication: 2 }) },
    ],
  },
  {
    id: "c11", emoji: "🧠", prompt: "Which one doesn't belong?",
    options: [
      { label: "🐶 dog", traits: {} },
      { label: "🐱 cat", traits: {} },
      { label: "🚗 car", traits: t({ logic: 3 }) },
      { label: "🐰 rabbit", traits: {} },
    ],
  },
  {
    id: "c12", emoji: "🛠️", prompt: "Your favorite school subject is…",
    options: [
      { label: "Math or science", traits: t({ logic: 3, problemSolving: 1 }) },
      { label: "Art or music", traits: t({ creativity: 3 }) },
      { label: "Reading or writing", traits: t({ communication: 3 }) },
      { label: "Sports or P.E.", traits: t({ teamwork: 2, leadership: 1 }) },
    ],
  },
  {
    id: "c13", emoji: "💡", prompt: "When something is hard, you…",
    options: [
      { label: "Keep trying until it works", traits: t({ problemSolving: 3 }) },
      { label: "Ask someone for help", traits: t({ communication: 2, teamwork: 1 }) },
      { label: "Find a creative new way", traits: t({ creativity: 3 }) },
      { label: "Break it into small steps", traits: t({ logic: 2, problemSolving: 1 }) },
    ],
  },
  {
    id: "c14", emoji: "🌍", prompt: "What would you invent to help the world?",
    options: [
      { label: "A robot that helps people", traits: t({ creativity: 2, problemSolving: 2 }) },
      { label: "A school where everyone learns", traits: t({ leadership: 2, communication: 1 }) },
      { label: "A machine that cleans oceans", traits: t({ curiosity: 2, problemSolving: 2 }) },
      { label: "A game that teaches kids", traits: t({ creativity: 3 }) },
    ],
  },
  {
    id: "c15", emoji: "🎲", prompt: "Which pattern comes next? 1, 3, 5, 7, ?",
    options: [
      { label: "8", traits: {} },
      { label: "9", traits: t({ logic: 3 }) },
      { label: "10", traits: {} },
      { label: "11", traits: t({ logic: 1 }) },
    ],
  },
  {
    id: "c16", emoji: "🤖", prompt: "If your team built a robot, you'd…",
    options: [
      { label: "Design how it looks", traits: t({ creativity: 3 }) },
      { label: "Program how it thinks", traits: t({ logic: 3 }) },
      { label: "Decide what it does", traits: t({ leadership: 3 }) },
      { label: "Tell people about it", traits: t({ communication: 3 }) },
    ],
  },
  {
    id: "c17", emoji: "🌟", prompt: "What makes you most proud?",
    options: [
      { label: "Helping a friend feel better", traits: t({ teamwork: 2, communication: 2 }) },
      { label: "Finishing a tough challenge", traits: t({ problemSolving: 3 }) },
      { label: "Making something beautiful", traits: t({ creativity: 3 }) },
      { label: "Leading a fun activity", traits: t({ leadership: 3 }) },
    ],
  },
  {
    id: "c18", emoji: "🧩", prompt: "If a friend is sad, you…",
    options: [
      { label: "Listen and ask how they feel", traits: t({ communication: 3 }) },
      { label: "Tell a joke to cheer them up", traits: t({ creativity: 2, communication: 1 }) },
      { label: "Invite them to do something", traits: t({ teamwork: 3 }) },
      { label: "Find what's wrong and fix it", traits: t({ problemSolving: 3 }) },
    ],
  },
  {
    id: "c19", emoji: "📦", prompt: "You get a big empty box! You…",
    options: [
      { label: "Make a fort with friends", traits: t({ teamwork: 2, creativity: 1 }) },
      { label: "Turn it into a spaceship", traits: t({ creativity: 3 }) },
      { label: "Wonder what was inside", traits: t({ curiosity: 3 }) },
      { label: "Build something useful", traits: t({ problemSolving: 2, creativity: 1 }) },
    ],
  },
  {
    id: "c20", emoji: "🏆", prompt: "Your dream is to one day…",
    options: [
      { label: "Discover something new", traits: t({ curiosity: 3 }) },
      { label: "Lead a great team", traits: t({ leadership: 3 }) },
      { label: "Make people happy", traits: t({ communication: 2, teamwork: 1 }) },
      { label: "Build something amazing", traits: t({ creativity: 2, problemSolving: 1 }) },
    ],
  },
];

export const TRAIT_LABELS: Record<ChildTrait, { name: string; emoji: string; badge: string }> = {
  curiosity: { name: "Curious Explorer", emoji: "🔍", badge: "Curiosity" },
  creativity: { name: "Creative Thinker", emoji: "🎨", badge: "Creativity" },
  teamwork: { name: "Team Player", emoji: "🤝", badge: "Teamwork" },
  leadership: { name: "Future Leader", emoji: "👑", badge: "Leadership" },
  communication: { name: "Great Communicator", emoji: "💬", badge: "Communication" },
  problemSolving: { name: "Problem Solver", emoji: "💡", badge: "Problem Solving" },
  logic: { name: "Logic Master", emoji: "🧠", badge: "Logic" },
};

export const FUTURE_DIRECTIONS: { key: ChildTrait[]; emoji: string; title: string; desc: string }[] = [
  { key: ["logic", "problemSolving"], emoji: "🔬", title: "Science & Discovery", desc: "Experiments, math puzzles, learning how things work." },
  { key: ["creativity"], emoji: "🎨", title: "Arts & Creativity", desc: "Drawing, music, design, storytelling." },
  { key: ["logic", "curiosity"], emoji: "💻", title: "Technology & Innovation", desc: "Coding basics, robotics clubs, building things." },
  { key: ["leadership", "teamwork"], emoji: "🌟", title: "Leadership & Business", desc: "Lead group projects, run a small lemonade stand, start a club." },
  { key: ["communication"], emoji: "🎤", title: "Communication & Media", desc: "Writing stories, podcasts, school presentations." },
];

export type ChildResult = {
  scores: Record<ChildTrait, number>;
  topTraits: ChildTrait[];
  directions: { emoji: string; title: string; desc: string }[];
};

export function scoreChildAssessment(answers: Record<string, number>): ChildResult {
  const scores: Record<ChildTrait, number> = {
    curiosity: 0, creativity: 0, teamwork: 0, leadership: 0,
    communication: 0, problemSolving: 0, logic: 0,
  };
  for (const q of childQuestions) {
    const idx = answers[q.id];
    if (idx == null) continue;
    const opt = q.options[idx];
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.traits)) {
      scores[k as ChildTrait] += v ?? 0;
    }
  }
  const topTraits = (Object.entries(scores) as [ChildTrait, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
  const topSet = new Set(topTraits);
  const directions = FUTURE_DIRECTIONS
    .map((d) => ({ ...d, overlap: d.key.filter((k) => topSet.has(k)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map(({ emoji, title, desc }) => ({ emoji, title, desc }));
  return { scores, topTraits, directions };
}

export const CHILD_ROADMAP = [
  { emoji: "📚", title: "Read a book about something new", aura: 10 },
  { emoji: "🧩", title: "Solve a puzzle this week", aura: 10 },
  { emoji: "🎨", title: "Create something with your hands", aura: 15 },
  { emoji: "🤝", title: "Help a friend or family member", aura: 10 },
  { emoji: "🚀", title: "Try one brand-new activity", aura: 20 },
  { emoji: "💻", title: "Learn 1 coding basic on Code.org", aura: 15 },
];
