import { buildCareerEvidence, type DirectAnswer, type CareerEvidence } from "./career-evidence";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  scorePersonality,
  scoreCognitive,
  scoreInterests,
  matchCareers,
  matchMajors,
  attachMajorsToCareers,
  deriveStrengths,
  deriveImprovements,
  RECOMMENDED_SKILLS_BY_PROFILE,
  type Career,
  type Major,
  type RiasecProfile,
  type CognitiveScore,
} from "./career-engine";
import {
  DIRECT_SCORING_VERSION,
  DIRECT_PREFERENCES_VERSION,
  LEGACY_VISUAL_VERSION,
  evidenceCoverage,
  presentationSummary,
} from "./summary-integrity";
import {
  PERSONALITY_BANK,
  IQ_BANK,
  INTEREST_BANK,
  getIQCorrect,
  getInterestRiasec,
  pickSessionQuestions,
} from "./question-bank";
import { QUESTION_TRANSLATIONS } from "./question-translations";
import { CHILD_PERSONALITY, CHILD_INTEREST } from "./child-questions";
import { ADULT_ACTIVITY_BANK } from "./activity-questions";
import type { AgeGroup } from "./career-assessment";
import type { RiasecDim, InterestVisual } from "./career-assessment";
import { ensureNotBanned } from "../admin/admin.functions";
import { readAll, readAllResult } from "../db-read";
import { validateCatalog } from "./catalog";
import { resultInterestProfile } from "./result-interest-profile";
import { loadOwnedSchool } from "../schools/owned-school";

// ---------- Session start (server-authoritative question delivery) ----------
// Questions are picked and translated on the server so the client never
// downloads the full question banks or the correct IQ answers. Each question
// carries its text in all three languages (only the 30 picked ones — tiny),
// so client-side language switching keeps working.
export type LangText = { en: string; ru: string; uz: string };
export type LangOpts = { en: string[]; ru: string[]; uz: string[] };
export type ClientSession = {
  sessionToken: string;
  personality: { id: string; prompt: LangText }[];
  iq: { id: string; prompt: LangText; options: LangOpts }[];
  interest: {
    id: string;
    theme: string;
    prompt: LangText;
    options: { id: string; visual: InterestVisual }[];
    labels: LangOpts;
  }[];
};

function lp(id: string, en: string): LangText {
  const tr = QUESTION_TRANSLATIONS[id];
  return { en, ru: tr?.ru?.prompt ?? en, uz: tr?.uz?.prompt ?? en };
}
function lo(id: string, en: string[]): LangOpts {
  const tr = QUESTION_TRANSLATIONS[id];
  return { en, ru: tr?.ru?.options ?? en, uz: tr?.uz?.options ?? en };
}

// Public (no auth): anonymous users can take the assessment, then sign in to
// submit. Correct answers and RIASEC weights are never included.
async function deliverSession(age: AgeGroup): Promise<ClientSession> {
  const s = pickSessionQuestions(age);
  const { signSession } = await import("./session.server");
  const sessionToken = signSession({
    personality: s.personality.map((q) => q.id),
    iq: s.iq.map((q) => q.id),
    iqOptionOrders: s.iq.map((q) => q.optionOrder!),
    interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
  });
  return {
    sessionToken,
    personality: s.personality.map((q) => ({ id: q.id, prompt: lp(q.id, q.prompt) })),
    iq: s.iq.map((q) => {
      const canonical = IQ_BANK.find((item) => item.id === q.id)!;
      const labels = lo(q.id, canonical.options);
      const order = q.optionOrder!;
      return {
        id: q.id,
        prompt: lp(q.id, q.prompt),
        options: {
          en: order.map((i) => labels.en[i]),
          ru: order.map((i) => labels.ru[i]),
          uz: order.map((i) => labels.uz[i]),
        },
      };
    }),
    interest: s.interest.map((q) => ({
      id: q.id,
      theme: q.theme,
      prompt: lp(q.id, q.prompt),
      options: q.options.map((o) => ({ id: o.id, visual: o.visual })),
      labels: (() => {
        const canonical = [...INTEREST_BANK, ...CHILD_INTEREST, ...ADULT_ACTIVITY_BANK].find(
          (item) => item.id === q.id,
        )!;
        const labels = lo(
          q.id,
          canonical.options.map((o) => o.label),
        );
        const order = q.options.map((o) => canonical.options.findIndex((item) => item.id === o.id));
        return {
          en: order.map((i) => labels.en[i]),
          ru: order.map((i) => labels.ru[i]),
          uz: order.map((i) => labels.uz[i]),
        };
      })(),
    })),
  };
}
export const startCareerSession = createServerFn({ method: "GET" }).handler(() =>
  deliverSession("teen_adult"),
);
// Identical request for every visitor: demographic selections never cross this boundary.
export const startProfileSessions = createServerFn({ method: "GET" }).handler(async () => ({
  child: await deliverSession("child"),
  teen_adult: await deliverSession("teen_adult"),
}));

export type CareerResultDTO = {
  id: string;
  personality_type: string | null;
  work_style: string | null;
  leadership_style: string | null;
  learning_style: string | null;
  team_style: string | null;
  cognitive_score: number | null;
  cognitive_tier: string | null;
  cognitive_profile: string | null;
  interests: { key: string; weight: number }[];
  riasec_profile: RiasecProfile;
  riasec_is_estimated: boolean;
  holland_code: string[];
  career_matches: {
    key: string;
    name: string;
    category: string;
    score: number;
    major?: string | null;
    matchFields?: string[];
    evidence?: CareerEvidence;
  }[];
  university_matches: { key: string; name: string; category: string; score: number }[];
  strengths: string[];
  improvements: string[];
  summary_unverified?: boolean;
  evidence_coverage: "direct" | "limited" | "historical";
  recommended_skills: string[];
  created_at: string;
};

const submitSchema = z.object({
  sessionToken: z.string().min(1).max(12000),
  personalityQIds: z.array(z.string()).length(12),
  personalityAnswers: z.array(z.number().int().min(1).max(5)).length(12),
  iqQIds: z.array(z.string()).max(9),
  iqAnswers: z.array(z.number().int().min(-1).max(3)).max(9),
  interestQIds: z.array(z.string()).min(9).max(18),
  // Each interest question is single-select, so at most one option id per question.
  interestAnswers: z.array(z.array(z.string()).max(1)).min(9).max(18),
});

export const submitCareerAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => submitSchema.parse(d))
  .handler(async ({ data, context }): Promise<CareerResultDTO> => {
    const { supabase, userId } = context;
    await ensureNotBanned(userId);
    const { verifySession, validateSessionSubmission, sessionIQAnswerKeys } =
      await import("./session.server");
    const claim = verifySession(data.sessionToken);
    validateSessionSubmission(claim, data);

    // Resolve personality questions from bank (server authoritative). Every id
    // must exist and be distinct — silently filtering unknown ids would shift
    // the questions array against the parallel answers array and score each
    // remaining answer against the wrong question; duplicates would let a
    // crafted client weight one axis 12 times.
    const personalityQs = data.personalityQIds.map((id) =>
      [...PERSONALITY_BANK, ...CHILD_PERSONALITY].find((q) => q.id === id),
    );
    if (
      personalityQs.some((q) => q === undefined) ||
      new Set(data.personalityQIds).size !== data.personalityQIds.length
    ) {
      throw new Error("invalid_session: unknown or duplicate personality question ids");
    }

    // Resolve IQ correct answers server-side (never sent to client). An unknown
    // question id yields an impossible sentinel (-999) — never -1, which is also
    // the "unanswered" answer value, so a bogus id can't be scored as correct.
    const iqCorrect = sessionIQAnswerKeys(
      claim,
      data.iqQIds.map((id) => getIQCorrect(id) ?? -999),
    );

    const personality = scorePersonality(
      data.personalityAnswers,
      personalityQs as NonNullable<(typeof PERSONALITY_BANK)[number]>[],
    );
    const preferencesOnly = claim.iq.length === 0;
    const cognitive: CognitiveScore = preferencesOnly
      ? { score: 0, tier: "Not assessed", profile: "Exploring" }
      : scoreCognitive(data.iqAnswers, iqCorrect, personality.mbti);

    // Interests: the client submits the ids of the symbols it chose. We resolve
    // each id to its hidden RIASEC vector server-side (authoritative), then the
    // engine aggregates and infers concrete field interests.
    const directQuestionIds = new Set([...ADULT_ACTIVITY_BANK, ...CHILD_INTEREST].map((q) => q.id));
    const selectedEvidence: DirectAnswer[] = [];
    const directPicks: Partial<Record<RiasecDim, number>>[] = [];
    const visualPicks: Partial<Record<RiasecDim, number>>[] = [];
    data.interestQIds.forEach((id, index) => {
      for (const optionId of data.interestAnswers[index]) {
        const vector = getInterestRiasec(optionId);
        if (vector) (directQuestionIds.has(id) ? directPicks : visualPicks).push(vector);
        if (vector && directQuestionIds.has(id)) {
          const question = [...ADULT_ACTIVITY_BANK, ...CHILD_INTEREST].find((q) => q.id === id)!;
          const index = question.options.findIndex((o) => o.id === optionId);
          const labels = lo(
            id,
            question.options.map((o) => o.label),
          );
          selectedEvidence.push({
            questionId: id,
            prompt: lp(id, question.prompt),
            answer: { en: labels.en[index], ru: labels.ru[index], uz: labels.uz[index] },
            fields: scoreInterests([vector])
              .interests.filter((f) => f.weight >= 0.5)
              .map((f) => f.key),
          });
        }
      }
    });
    const directScore = scoreInterests(directPicks);
    const displayScore = directPicks.length ? directScore : scoreInterests(visualPicks);
    const { interests, riasec } = displayScore;
    const matchInterests = directScore.interests;
    const hasDirectEvidence = directPicks.length > 0;

    const [careers, majors] = await Promise.all([
      readAll((from, to) => supabase.from("careers").select("*").order("id").range(from, to)),
      readAll((from, to) =>
        supabase.from("university_majors").select("*").order("id").range(from, to),
      ),
    ]);
    const { CAREER_CATALOG, MAJOR_CATALOG, completeCatalog } = await import("./catalog.server");
    const catalog = validateCatalog(
      completeCatalog(CAREER_CATALOG, careers as unknown as Career[]),
      completeCatalog(MAJOR_CATALOG, majors as unknown as Major[]),
    );
    const careerList = catalog.careers;
    const majorList = catalog.majors.map((major) => ({
      ...major,
      related_career_keys: [
        ...new Set([
          ...major.related_career_keys,
          ...(MAJOR_CATALOG.find((item) => item.key === major.key)?.related_career_keys ?? []),
        ]),
      ],
    }));

    const allMajorScores = matchMajors(
      majorList,
      personality,
      cognitive,
      matchInterests,
      preferencesOnly,
    );
    const rankedCareers = attachMajorsToCareers(
      matchCareers(careerList, personality, cognitive, matchInterests, preferencesOnly),
      majorList,
      allMajorScores,
    );
    const careerMatches = rankedCareers.map((c) => ({
      ...c,
      evidence: buildCareerEvidence(
        careerList.find((item) => item.key === c.key)?.required_interests ?? [],
        selectedEvidence,
      ),
    }));
    const universityMatches = allMajorScores.slice(0, 10);
    const strengths = preferencesOnly
      ? []
      : deriveStrengths(
          personality,
          cognitive,
          data.personalityAnswers,
          personalityQs as NonNullable<(typeof PERSONALITY_BANK)[number]>[],
        );
    const improvements = preferencesOnly
      ? []
      : deriveImprovements(
          personality,
          cognitive,
          data.personalityAnswers,
          personalityQs as NonNullable<(typeof PERSONALITY_BANK)[number]>[],
        );

    // Persist
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { persistAssessmentResult } = await import("./result-storage.server");
    const row = await persistAssessmentResult(supabaseAdmin, {
      user_id: userId,
      session_nonce: claim.nonce,
      scoring_version: hasDirectEvidence
        ? preferencesOnly
          ? DIRECT_PREFERENCES_VERSION
          : DIRECT_SCORING_VERSION
        : LEGACY_VISUAL_VERSION,
      personality_type: personality.mbti,
      work_style: personality.workStyle,
      leadership_style: personality.leadershipStyle,
      learning_style: personality.learningStyle,
      team_style: personality.teamStyle,
      cognitive_score: preferencesOnly ? null : cognitive.score,
      cognitive_tier: cognitive.tier,
      cognitive_profile: cognitive.profile,
      interests,
      riasec_profile: riasec,
      career_matches: careerMatches,
      university_matches: universityMatches,
      strengths,
      improvements,
    });

    return {
      id: row.id,
      personality_type: row.personality_type,
      ...presentationSummary(row),
      evidence_coverage: evidenceCoverage(row.scoring_version),
      cognitive_score: row.cognitive_score,
      cognitive_tier: row.cognitive_tier,
      cognitive_profile: row.cognitive_profile,
      interests: row.interests as { key: string; weight: number }[],
      ...resultInterestProfile(
        row.riasec_profile,
        row.interests as { key: string; weight: number }[],
      ),
      career_matches: row.career_matches as CareerResultDTO["career_matches"],
      university_matches: row.university_matches as CareerResultDTO["university_matches"],
      // A retry can recover a historical row: keep its saved profile authoritative.
      recommended_skills: RECOMMENDED_SKILLS_BY_PROFILE[row.cognitive_profile ?? ""] ?? [],
      created_at: row.created_at,
    };
  });

export const getMyCareerResult = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { resultId?: string } | undefined) =>
    z.object({ resultId: z.string().uuid().optional() }).parse(d ?? {}),
  )
  .handler(async ({ context, data: input }): Promise<CareerResultDTO | null> => {
    const { supabase, userId } = context;
    let query = supabase.from("career_assessment_results").select("*").eq("user_id", userId);
    if (input.resultId) query = query.eq("id", input.resultId);
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: data.id,
      personality_type: data.personality_type,
      ...presentationSummary(data),
      evidence_coverage: evidenceCoverage(data.scoring_version),
      cognitive_score: data.cognitive_score,
      cognitive_tier: data.cognitive_tier,
      cognitive_profile: data.cognitive_profile,
      interests: data.interests as { key: string; weight: number }[],
      ...resultInterestProfile(
        data.riasec_profile,
        data.interests as { key: string; weight: number }[],
      ),
      career_matches: data.career_matches as CareerResultDTO["career_matches"],
      university_matches: data.university_matches as CareerResultDTO["university_matches"],
      recommended_skills: RECOMMENDED_SKILLS_BY_PROFILE[data.cognitive_profile ?? ""] ?? [],
      created_at: data.created_at,
    };
  });

// ---------- School analytics ----------
export type SchoolCareerOverviewDTO = {
  totalStudents: number;
  completed: number;
  careerDistribution: { name: string; count: number; category: string }[];
  personalityDistribution: { type: string; count: number }[];
  cognitiveDistribution: { tier: string; count: number }[];
  universityDistribution: { name: string; count: number }[];
  classHeatmap: { className: string; buckets: Record<string, number> }[];
  students: {
    user_id: string;
    name: string;
    class_name: string | null;
    mbti: string | null;
    cognitive_score: number | null;
    cognitive_profile: string | null;
    top_career: { name: string; score: number } | null;
    top_major: { name: string; score: number } | null;
    career_matches: { key: string; name: string; category: string; score: number }[];
    university_matches: { key: string; name: string; category: string; score: number }[];
  }[];
};

export const getSchoolCareerOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SchoolCareerOverviewDTO> => {
    const { supabase, userId } = context;
    const school = await loadOwnedSchool(supabase, userId);

    const { data: members } = await readAllResult((from, to) =>
      supabase
        .from("school_members")
        .select("user_id, role, class_id")
        .eq("school_id", school.id)
        .eq("role", "student")
        .order("id")
        .range(from, to),
    );

    const userIds = (members ?? []).map((m) => m.user_id);

    type NameRow = { id: string; name: string | null; surname: string | null };
    type OverviewResultRow = {
      user_id: string;
      created_at: string;
      personality_type: string;
      cognitive_tier: string;
      cognitive_score: number | null;
      cognitive_profile: string | null;
      career_matches: { key: string; name: string; category: string; score: number }[] | null;
      university_matches: { key: string; name: string; category: string; score: number }[] | null;
    };
    const [classesRes, profilesRes, resultsRes] = await Promise.all([
      readAllResult((from, to) =>
        supabase
          .from("school_classes")
          .select("id, name")
          .eq("school_id", school.id)
          .order("id")
          .range(from, to),
      ),
      userIds.length
        ? readAllResult((from, to) =>
            supabase
              .from("profiles")
              .select("id, name, surname")
              .in("id", userIds)
              .order("id")
              .range(from, to),
          )
        : Promise.resolve({ data: [] as NameRow[] }),
      userIds.length
        ? readAllResult((from, to) =>
            supabase
              .from("career_assessment_results")
              .select("*")
              .in("user_id", userIds)
              .order("id")
              .range(from, to),
          )
        : Promise.resolve({ data: [] }),
    ]);
    const classMap = new Map<string, string>();
    (classesRes.data ?? []).forEach((c) => classMap.set(c.id, c.name));
    const profileMap = new Map<string, { name: string; surname: string }>();
    ((profilesRes.data ?? []) as NameRow[]).forEach((p) =>
      profileMap.set(p.id, { name: p.name ?? "", surname: p.surname ?? "" }),
    );

    // Keep latest per user
    const latest = new Map<string, OverviewResultRow>();
    for (const r of (resultsRes.data ?? []) as unknown as OverviewResultRow[]) {
      const prev = latest.get(r.user_id);
      if (!prev || new Date(r.created_at) > new Date(prev.created_at)) latest.set(r.user_id, r);
    }

    const careerCounts: Record<string, { count: number; category: string }> = {};
    const personalityCounts: Record<string, number> = {};
    const cognitiveCounts: Record<string, number> = {};
    const universityCounts: Record<string, number> = {};
    const heatmap: Record<string, Record<string, number>> = {};

    const students = (members ?? []).map((m) => {
      const r = latest.get(m.user_id);
      const className = m.class_id ? (classMap.get(m.class_id) ?? null) : null;
      const top = r?.career_matches?.[0];
      const topU = r?.university_matches?.[0];
      const prof = profileMap.get(m.user_id) ?? { name: "Student", surname: "" };
      if (r) {
        personalityCounts[r.personality_type] = (personalityCounts[r.personality_type] ?? 0) + 1;
        const scoreBand =
          r.cognitive_score == null
            ? "Not assessed"
            : r.cognitive_score <= 2
              ? "0–2 of 9"
              : r.cognitive_score <= 5
                ? "3–5 of 9"
                : "6–9 of 9";
        cognitiveCounts[scoreBand] = (cognitiveCounts[scoreBand] ?? 0) + 1;
        if (top) {
          careerCounts[top.category] = careerCounts[top.category] ?? {
            count: 0,
            category: top.category,
          };
          careerCounts[top.category].count++;
        }
        if (topU) universityCounts[topU.name] = (universityCounts[topU.name] ?? 0) + 1;
        if (className && top) {
          heatmap[className] = heatmap[className] ?? {};
          heatmap[className][top.category] = (heatmap[className][top.category] ?? 0) + 1;
        }
      }
      return {
        user_id: m.user_id,
        name: `${prof.name} ${prof.surname}`.trim() || "Student",
        class_name: className,
        mbti: r?.personality_type ?? null,
        cognitive_score: r?.cognitive_score ?? null,
        cognitive_profile: null,
        top_career: top ? { name: top.name, score: top.score } : null,
        top_major: topU ? { name: topU.name, score: topU.score } : null,
        career_matches: r?.career_matches ?? [],
        university_matches: r?.university_matches ?? [],
      };
    });

    return {
      totalStudents: students.length,
      completed: Array.from(latest.values()).length,
      careerDistribution: Object.entries(careerCounts)
        .map(([name, v]) => ({ name, count: v.count, category: v.category }))
        .sort((a, b) => b.count - a.count),
      personalityDistribution: Object.entries(personalityCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      cognitiveDistribution: Object.entries(cognitiveCounts).map(([tier, count]) => ({
        tier,
        count,
      })),
      universityDistribution: Object.entries(universityCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      classHeatmap: Object.entries(heatmap).map(([className, buckets]) => ({ className, buckets })),
      students,
    };
  });

export const buildSpecializedClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        focusCategory: z.string().min(1).max(64),
        size: z.number().int().min(1).max(60).default(20),
        save: z.boolean().default(false),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const school = await loadOwnedSchool(supabase, userId);

    type MatchEntry = { name: string; category: string; score: number };
    type StudentEntry = { user_id: string; name: string; matches: MatchEntry[] };

    const overview = await (async (): Promise<{ students: StudentEntry[] }> => {
      // inline minimal fetch
      const { data: members } = await readAllResult((from, to) =>
        supabase
          .from("school_members")
          .select("user_id, role")
          .eq("school_id", school.id)
          .eq("role", "student")
          .order("id")
          .range(from, to),
      );
      const userIds = (members ?? []).map((m) => m.user_id);
      if (!userIds.length) return { students: [] };
      const [profilesRes, resultsRes] = await Promise.all([
        readAllResult((from, to) =>
          supabase
            .from("profiles")
            .select("id, name, surname")
            .in("id", userIds)
            .order("id")
            .range(from, to),
        ),
        readAllResult((from, to) =>
          supabase
            .from("career_assessment_results")
            .select("*")
            .in("user_id", userIds)
            .order("id")
            .range(from, to),
        ),
      ]);
      type NameRow = { id: string; name: string | null; surname: string | null };
      type ResultRow = { user_id: string; created_at: string; career_matches: MatchEntry[] | null };
      const pmap = new Map<string, NameRow>(
        ((profilesRes.data ?? []) as NameRow[]).map((p) => [p.id, p]),
      );
      const latest = new Map<string, ResultRow>();
      for (const r of (resultsRes.data ?? []) as unknown as ResultRow[]) {
        const prev = latest.get(r.user_id);
        if (!prev || new Date(r.created_at) > new Date(prev.created_at)) latest.set(r.user_id, r);
      }
      const students = userIds.map((uid) => {
        const r = latest.get(uid);
        const p = pmap.get(uid);
        return {
          user_id: uid,
          name: `${p?.name ?? ""} ${p?.surname ?? ""}`.trim() || "Student",
          matches: r?.career_matches ?? [],
        };
      });
      return { students };
    })();

    const ranked = overview.students
      .map((s) => {
        const best = s.matches.find(
          (m) => m.category.toLowerCase() === data.focusCategory.toLowerCase(),
        );
        return { ...s, score: best?.score ?? 0, best };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, data.size);

    let savedId: string | null = null;
    if (data.save && ranked.length) {
      const { data: id, error } = await supabase.rpc("school_save_specialized_class", {
        _school: school.id,
        _title: `${data.focusCategory} Class`,
        _focus: data.focusCategory,
        _focus_key: data.focusCategory.toLowerCase(),
        _reason: `Auto-built from Career Intelligence data; top ${ranked.length} students by ${data.focusCategory} fit.`,
        _students: ranked.map((r) => r.user_id),
      });
      if (error) throw new Error("Class suggestion was not saved. Please retry.");
      savedId = (id as string | null) ?? null;
    }

    return {
      focus: data.focusCategory,
      students: ranked.map((r) => ({ user_id: r.user_id, name: r.name, score: r.score })),
      savedId,
    };
  });

export const getCareerDirectory = createServerFn({ method: "GET" }).handler(async () => {
  const { CAREER_CATALOG } = await import("./catalog.server");
  return CAREER_CATALOG.map(({ key, name, category }) => ({ key, name, category }));
});
