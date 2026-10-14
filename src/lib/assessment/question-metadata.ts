import type { CognitiveQ, InterestQ, PersonalityQ } from "./career-assessment";

const PERSONALITY_GROUPS: Record<PersonalityQ["axis"], [RegExp, string][]> = {
  EI: [
    [/\b(part(?:y|ies)|gatherings?|large group|social events?)\b/i, "gatherings"],
    [/\b(meet(?:ing)? new people|strangers?|new faces)\b/i, "meeting-people"],
    [/\b(quiet|alone|solo|solitude)\b/i, "solitude"],
    [/\b(collaborat|team|group work)\b/i, "teamwork"],
  ],
  SN: [
    [/\b(concrete|facts?|details?)\b/i, "concrete-details"],
    [/\b(abstract|theor|concepts?)\b/i, "abstract-ideas"],
    [/\b(future|possibilit|big.picture)\b/i, "future-possibilities"],
    [/\b(patterns?|meanings?|connections?)\b/i, "patterns"],
    [/\b(hands.on|experience|practical)\b/i, "hands-on"],
  ],
  TF: [
    [/\b(logic|analys|reason)\b/i, "logic"],
    [/\b(emotion|feelings?|empath)\b/i, "emotions"],
    [/\b(fair|justice|principle)\b/i, "fairness"],
    [/\b(conflict|disagree|criticism)\b/i, "conflict"],
  ],
  JP: [
    [/\b(plan|schedul|organis|organiz)\b/i, "planning"],
    [/\b(spontan|surpris|improvis)\b/i, "spontaneity"],
    [/\b(deadline|finish|complete)\b/i, "completion"],
    [/\b(change|adapt|flexib)\b/i, "adaptation"],
  ],
};

export function tagPersonality(question: PersonalityQ): PersonalityQ {
  const family = PERSONALITY_GROUPS[question.axis].find(([pattern]) =>
    pattern.test(question.prompt),
  );
  question.trait = question.axis;
  question.similarityGroup = `personality:${question.axis}:${family?.[1] ?? question.id}`;
  return question;
}

export function tagCognitive(question: CognitiveQ): CognitiveQ {
  const prompt = question.prompt.toLowerCase();
  question.trait = /\b(word|letter|synonym|opposite|meaning|anagram)\b/.test(prompt)
    ? "verbal-reasoning"
    : /\d|percent|fraction|number|sum|calculate/.test(prompt)
      ? "quantitative-reasoning"
      : /shape|square|circle|rotate|corner|figure|diagram/.test(prompt)
        ? "spatial-reasoning"
        : "logical-reasoning";
  question.similarityGroup =
    question.id === "c2" || question.id === "c9"
      ? "cognitive:syllogism-sets"
      : `cognitive:${question.id}`;
  return question;
}

export function tagInterest(question: InterestQ): InterestQ {
  question.trait = `interest:${question.theme}`;
  question.similarityGroup = `interest:${question.id}`;
  return question;
}
