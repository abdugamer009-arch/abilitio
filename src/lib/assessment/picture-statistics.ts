export type PictureStatEvent = {
  user_id: string;
  session_nonce: string;
  question_id: string;
  question_set_version: string;
  section: string;
  age_group: string;
  slot: number | null;
  item_version: string | null;
  shown: boolean;
  answered: boolean;
  chosen_answer: string | null;
  time_ms: number;
  is_correct: boolean | null;
};
export type QuestionStat = {
  id: string;
  setVersion: string;
  section: string;
  ageGroup: string;
  slot: number | null;
  version: string | null;
  difficulty: string | null;
  shown: number;
  answered: number;
  correct: number;
  percentCorrect: number | null;
  averageTimeMs: number | null;
  options: { id: string; chosen: number; percent: number | null; correct: boolean | null }[];
  target: [number, number] | null;
  outsideTarget: boolean;
  distractorWins: boolean;
};
export type StatDefinition = {
  id: string;
  setVersion: string;
  slot: number | null;
  version: string | null;
  difficulty: string | null;
  correctId: string | null;
  section?: string;
  ageGroup?: string;
  optionIds: string[];
};
/** Percentages use answered attempts; time uses shown attempts, including unanswered shows. */
export function questionStatistics(events: PictureStatEvent[], definitions: StatDefinition[]) {
  const groups = new Map<string, QuestionStat>();
  const make = (e: {
    question_id: string;
    question_set_version: string;
    section: string;
    age_group: string;
    slot: number | null;
    item_version: string | null;
  }) => {
    const def = definitions.find(
      (d) =>
        d.id === e.question_id &&
        d.setVersion === e.question_set_version &&
        (d.ageGroup ?? "teen_adult") === e.age_group,
    );
    const target: [number, number] | null = def?.difficulty
      ? def.difficulty === "easy"
        ? [75, 90]
        : def.difficulty === "hard"
          ? [20, 45]
          : [45, 70]
      : null;
    return {
      id: e.question_id,
      setVersion: e.question_set_version,
      section: e.section,
      ageGroup: e.age_group,
      slot: e.slot,
      version: e.item_version,
      difficulty: def?.difficulty ?? null,
      shown: 0,
      answered: 0,
      correct: 0,
      percentCorrect: null,
      averageTimeMs: null,
      options: (def?.optionIds ?? []).map((id) => ({
        id,
        chosen: 0,
        percent: null,
        correct: def?.correctId ? id === def.correctId : null,
      })),
      target,
      outsideTarget: false,
      distractorWins: false,
    } as QuestionStat;
  };
  const key = (set: string, age: string, id: string) => `${set}:${age}:${id}`;
  for (const d of definitions)
    groups.set(
      key(d.setVersion, d.ageGroup ?? "teen_adult", d.id),
      make({
        question_id: d.id,
        question_set_version: d.setVersion,
        section: d.section ?? "cognitive",
        age_group: d.ageGroup ?? "teen_adult",
        slot: d.slot,
        item_version: d.version,
      }),
    );
  const times = new Map<string, number>(),
    seen = new Set<string>();
  for (const e of events) {
    // Storage is unique by owner/nonce/question; protect aggregation against duplicate pages too.
    const identity = `${e.user_id}:${e.session_nonce}:${e.question_id}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    const k = key(e.question_set_version, e.age_group, e.question_id),
      g = groups.get(k) ?? make(e);
    groups.set(k, g);
    if (e.shown) {
      g.shown++;
      times.set(k, (times.get(k) ?? 0) + e.time_ms);
    }
    if (e.answered && e.chosen_answer !== null) {
      g.answered++;
      if (e.is_correct === true) g.correct++;
      let o = g.options.find((o) => o.id === e.chosen_answer);
      if (!o) {
        o = { id: e.chosen_answer, chosen: 0, percent: null, correct: null };
        g.options.push(o);
      }
      o.chosen++;
    }
  }
  for (const [k, g] of groups) {
    g.percentCorrect =
      g.section === "cognitive" && g.answered ? (100 * g.correct) / g.answered : null;
    g.averageTimeMs = g.shown ? (times.get(k) ?? 0) / g.shown : null;
    for (const o of g.options) o.percent = g.answered ? (100 * o.chosen) / g.answered : null;
    g.outsideTarget =
      !!g.target &&
      g.percentCorrect !== null &&
      (g.percentCorrect < g.target[0] || g.percentCorrect > g.target[1]);
    g.distractorWins =
      g.section === "cognitive" &&
      g.options.some((o) => o.correct === false && o.chosen > g.correct);
  }
  const students = new Set(
    events.filter((e) => e.shown && e.section === "cognitive").map((e) => e.user_id),
  ).size;
  const pairs = Array.from(
    new Set(definitions.filter((d) => d.slot !== null).map((d) => d.slot)),
  ).map((slot) => {
    const pair = [...groups.values()].filter((g) => g.section === "cognitive" && g.slot === slot);
    return {
      slot,
      delta:
        pair.length === 2 && pair.every((q) => q.percentCorrect !== null)
          ? Math.abs(pair[0].percentCorrect! - pair[1].percentCorrect!)
          : null,
    };
  });
  return {
    students,
    questions: [...groups.values()].sort(
      (a, b) => (a.slot ?? 1000) - (b.slot ?? 1000) || a.id.localeCompare(b.id),
    ),
    pairs,
  };
}
