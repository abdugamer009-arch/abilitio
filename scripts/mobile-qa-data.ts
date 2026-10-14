// Node-only QA fixture builder. Hidden banks/keys are never passed to the browser.
import {
  PERSONALITY_BANK,
  IQ_BANK,
  pickSessionQuestions,
} from "../src/lib/assessment/question-bank";
import { CHILD_PERSONALITY, CHILD_INTEREST } from "../src/lib/assessment/child-questions";
import { ADULT_ACTIVITY_BANK } from "../src/lib/assessment/activity-questions";
import { QUESTION_TRANSLATIONS } from "../src/lib/assessment/question-translations";
import { signSession } from "../src/lib/assessment/session.server";
import { CAREER_CATALOG, MAJOR_CATALOG } from "../src/lib/assessment/catalog.server";
import {
  scorePersonality,
  scoreCognitive,
  scoreInterests,
  matchCareers,
  matchMajors,
} from "../src/lib/assessment/career-engine";
import type {
  AgeGroup,
  PersonalityQ,
  CognitiveQ,
  InterestQ,
} from "../src/lib/assessment/career-assessment";

const text = (q: { id: string; prompt: string }, lang: string) =>
  lang === "en"
    ? q.prompt
    : (QUESTION_TRANSLATIONS[q.id]?.[lang as "ru" | "uz"]?.prompt ?? q.prompt);
const options = (q: CognitiveQ | InterestQ, lang: string) =>
  lang === "en"
    ? q.section === "cognitive"
      ? q.options
      : q.options.map((o) => o.label)
    : (QUESTION_TRANSLATIONS[q.id]?.[lang as "ru" | "uz"]?.options ?? []);
const lp = (q: { id: string; prompt: string }) => ({
  en: text(q, "en"),
  ru: text(q, "ru"),
  uz: text(q, "uz"),
});
const lo = (q: CognitiveQ | InterestQ) => ({
  en: options(q, "en"),
  ru: options(q, "ru"),
  uz: options(q, "uz"),
});

export function buildFixtures(lang: string, mode: "longest" | "random") {
  const sessions: Record<string, unknown> = {};
  const results: Record<string, unknown> = {};
  const longest: Record<string, unknown> = {};
  for (const age of ["child", "teen_adult"] as AgeGroup[]) {
    const pPool = age === "child" ? CHILD_PERSONALITY : PERSONALITY_BANK;
    const iPool = age === "child" ? CHILD_INTEREST : ADULT_ACTIVITY_BANK;
    const s = pickSessionQuestions(age);
    if (mode === "longest") {
      s.personality = ["EI", "SN", "TF", "JP"].flatMap((axis) =>
        pPool
          .filter((q) => q.axis === axis)
          .sort((a, b) => text(b, lang).length - text(a, lang).length)
          .slice(0, 3),
      );
      if (age !== "child") {
        const byPrompt = [...IQ_BANK].sort((a, b) => text(b, lang).length - text(a, lang).length);
        const byOption = [...IQ_BANK].sort(
          (a, b) =>
            Math.max(...options(b, lang).map((v) => v.length)) -
            Math.max(...options(a, lang).map((v) => v.length)),
        );
        s.iq = [byPrompt[0], byOption[0], ...byPrompt]
          .filter((q, i, all) => all.findIndex((item) => item.id === q.id) === i)
          .slice(0, 9)
          .map((q) => ({ ...q, optionOrder: q.options.map((_, i) => i) }));
      }
      s.interest = [...iPool]
        .sort(
          (a, b) =>
            Math.max(text(b, lang).length, ...options(b, lang).map((v) => v.length)) -
            Math.max(text(a, lang).length, ...options(a, lang).map((v) => v.length)),
        )
        .slice(0, age === "child" ? 18 : 9);
    }
    // Surface the longest personality prompt first without changing axis balance.
    s.personality.sort((a, b) =>
      mode === "longest" ? text(b, lang).length - text(a, lang).length : 0,
    );
    const token = signSession({
      personality: s.personality.map((q) => q.id),
      iq: s.iq.map((q) => q.id),
      iqOptionOrders: s.iq.map((q) => q.optionOrder!),
      interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
    });
    sessions[age] = {
      sessionToken: token,
      personality: s.personality.map((q) => ({ id: q.id, prompt: lp(q) })),
      iq: s.iq.map((q) => {
        const canonical = IQ_BANK.find((item) => item.id === q.id)!;
        const labels = lo(canonical);
        const order = q.optionOrder!;
        return {
          id: q.id,
          prompt: lp(q),
          options: {
            en: order.map((n) => labels.en[n]),
            ru: order.map((n) => labels.ru[n]),
            uz: order.map((n) => labels.uz[n]),
          },
        };
      }),
      interest: s.interest.map((q) => {
        const canonical = iPool.find((item) => item.id === q.id)!;
        const labels = lo(canonical);
        const order = q.options.map((o) => canonical.options.findIndex((c) => c.id === o.id));
        return {
          id: q.id,
          theme: q.theme,
          prompt: lp(q),
          options: q.options.map((o) => ({ id: o.id, visual: o.visual })),
          labels: {
            en: order.map((n) => labels.en[n]),
            ru: order.map((n) => labels.ru[n]),
            uz: order.map((n) => labels.uz[n]),
          },
        };
      }),
    };
    const personality = scorePersonality(Array(12).fill(4), s.personality as PersonalityQ[]);
    const cognitive = scoreCognitive(
      s.iq.map(() => 0),
      s.iq.map((q) => q.correct),
      personality.mbti,
    );
    const { interests, riasec } = scoreInterests(s.interest.map((q) => q.options[0].riasec));
    results[age] = {
      id: `mobile-${age}`,
      evidence_coverage: "direct",
      personality_type: personality.mbti,
      work_style: personality.workStyle,
      leadership_style: personality.leadershipStyle,
      learning_style: personality.learningStyle,
      team_style: personality.teamStyle,
      cognitive_score: age === "child" ? null : cognitive.score,
      cognitive_tier: age === "child" ? "Not assessed" : cognitive.tier,
      cognitive_profile: cognitive.profile,
      interests,
      riasec_profile: riasec,
      riasec_is_estimated: false,
      holland_code: [...Object.entries(riasec)]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k),
      career_matches: matchCareers(
        CAREER_CATALOG,
        personality,
        cognitive,
        interests,
        age === "child",
      ),
      university_matches: matchMajors(
        MAJOR_CATALOG,
        personality,
        cognitive,
        interests,
        age === "child",
      ).slice(0, 10),
      strengths: [],
      improvements: [],
      recommended_skills: [],
      created_at: "2026-10-14T00:00:00Z",
    };
    longest[age] = {
      personality: s.personality[0].id,
      reasoning: s.iq[0]?.id,
      options: s.iq[1]?.id,
      interest: s.interest[0].id,
    };
  }
  return { sessions, results, longest };
}
