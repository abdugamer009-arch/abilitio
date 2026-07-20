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
  communitySlugForCareer,
  deriveStrengths,
  deriveImprovements,
  RECOMMENDED_SKILLS_BY_PROFILE,
  deriveRiasecFromInterests,
  hollandCode,
  type Career,
  type Major,
  type RiasecProfile,
} from "./career-engine";
import {
  PERSONALITY_BANK,
  getIQCorrect,
  getInterestRiasec,
  pickSessionQuestions,
} from "./question-bank";
import { QUESTION_TRANSLATIONS } from "./question-translations";
import type { RiasecDim, InterestVisual } from "./career-assessment";
import { ensureNotBanned } from "../admin/admin.functions";

// ---------- Session start (server-authoritative question delivery) ----------
// Questions are picked and translated on the server so the client never
// downloads the full question banks or the correct IQ answers. Each question
// carries its text in all three languages (only the 30 picked ones — tiny),
// so client-side language switching keeps working.
export type LangText = { en: string; ru: string; uz: string };
export type LangOpts = { en: string[]; ru: string[]; uz: string[] };
export type ClientSession = {
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
export const startCareerSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClientSession> => {
    const s = pickSessionQuestions();
    return {
      personality: s.personality.map((q) => ({ id: q.id, prompt: lp(q.id, q.prompt) })),
      iq: s.iq.map((q) => ({ id: q.id, prompt: lp(q.id, q.prompt), options: lo(q.id, q.options) })),
      interest: s.interest.map((q) => ({
        id: q.id,
        theme: q.theme,
        prompt: lp(q.id, q.prompt),
        options: q.options.map((o) => ({ id: o.id, visual: o.visual })),
        labels: lo(
          q.id,
          q.options.map((o) => o.label),
        ),
      })),
    };
  },
);

// Derive the RIASEC profile + Holland code (top-3 dimensions) from the persisted
// field-interest weights, so both fresh and historical results carry them
// without a stored column.
function hollandFor(interests: { key: string; weight: number }[]): {
  riasec_profile: RiasecProfile;
  holland_code: string[];
} {
  const riasec_profile = deriveRiasecFromInterests(interests);
  return { riasec_profile, holland_code: hollandCode(riasec_profile) };
}

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
  holland_code: string[];
  career_matches: {
    key: string;
    name: string;
    category: string;
    score: number;
    major?: string | null;
    matchFields?: string[];
  }[];
  university_matches: { key: string; name: string; category: string; score: number }[];
  strengths: string[];
  improvements: string[];
  recommended_skills: string[];
  created_at: string;
  /** Name of the community the submit auto-joined, so the UI can say so.
   *  Only set on fresh submissions; null when the join was skipped/failed. */
  joined_community?: string | null;
};

const submitSchema = z.object({
  personalityQIds: z.array(z.string()).length(12),
  personalityAnswers: z.array(z.number().int().min(1).max(5)).length(12),
  iqQIds: z.array(z.string()).length(9),
  iqAnswers: z.array(z.number().int().min(-1).max(3)).length(9),
  interestQIds: z.array(z.string()).length(9),
  // Each interest question is single-select, so at most one option id per question.
  interestAnswers: z.array(z.array(z.string()).max(1)).length(9),
});

export const submitCareerAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => submitSchema.parse(d))
  .handler(async ({ data, context }): Promise<CareerResultDTO> => {
    const { supabase, userId } = context;
    await ensureNotBanned(userId);

    // Resolve personality questions from bank (server authoritative). Every id
    // must exist and be distinct — silently filtering unknown ids would shift
    // the questions array against the parallel answers array and score each
    // remaining answer against the wrong question; duplicates would let a
    // crafted client weight one axis 12 times.
    const personalityQs = data.personalityQIds.map((id) =>
      PERSONALITY_BANK.find((q) => q.id === id),
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
    const iqCorrect = data.iqQIds.map((id) => getIQCorrect(id) ?? -999);

    const personality = scorePersonality(
      data.personalityAnswers,
      personalityQs as NonNullable<(typeof PERSONALITY_BANK)[number]>[],
    );
    const cognitive = scoreCognitive(data.iqAnswers, iqCorrect, personality.mbti);

    // Interests: the client submits the ids of the symbols it chose. We resolve
    // each id to its hidden RIASEC vector server-side (authoritative), then the
    // engine aggregates and infers concrete field interests.
    const interestPicks: Partial<Record<RiasecDim, number>>[] = data.interestAnswers
      .flat()
      .map((optionId) => getInterestRiasec(optionId))
      .filter((v): v is Partial<Record<RiasecDim, number>> => v !== null);
    const { interests } = scoreInterests(interestPicks);

    const [{ data: careers }, { data: majors }] = await Promise.all([
      supabase.from("careers").select("*"),
      supabase.from("university_majors").select("*"),
    ]);
    const careerList = (careers ?? []) as unknown as Career[];
    const majorList = (majors ?? []) as unknown as Major[];

    const allMajorScores = matchMajors(majorList, personality, cognitive, interests);
    const careerMatches = attachMajorsToCareers(
      matchCareers(careerList, personality, cognitive, interests).slice(0, 15),
      majorList,
      allMajorScores,
    );
    const universityMatches = allMajorScores.slice(0, 10);
    const strengths = deriveStrengths(personality, cognitive);
    const improvements = deriveImprovements(personality, cognitive);
    const recommendedSkills = RECOMMENDED_SKILLS_BY_PROFILE[cognitive.profile] ?? [];

    // Persist
    const { data: row, error } = await supabase
      .from("career_assessment_results")
      .insert({
        user_id: userId,
        personality_type: personality.mbti,
        work_style: personality.workStyle,
        leadership_style: personality.leadershipStyle,
        learning_style: personality.learningStyle,
        team_style: personality.teamStyle,
        cognitive_score: cognitive.score,
        cognitive_tier: cognitive.tier,
        cognitive_profile: cognitive.profile,
        interests,
        career_matches: careerMatches,
        university_matches: universityMatches,
        strengths,
        improvements,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    // Auto-join the community matching the #1 career. Best-effort: a failure
    // here must never fail the assessment itself. The joined community's name
    // is returned so the client can tell the user it happened.
    let joinedCommunity: string | null = null;
    try {
      const slug = communitySlugForCareer(careerMatches[0]);
      const { data: cid } = await supabase.rpc("assign_user_to_community_by_slug", {
        _slug: slug,
      });
      if (cid) {
        const { data: c } = await supabase
          .from("communities")
          .select("name")
          .eq("id", cid as string)
          .maybeSingle();
        joinedCommunity = (c as { name?: string } | null)?.name ?? null;
      }
    } catch (e) {
      console.warn("[career] community auto-join failed", e);
    }

    return {
      id: row.id,
      personality_type: row.personality_type,
      work_style: row.work_style,
      leadership_style: row.leadership_style,
      learning_style: row.learning_style,
      team_style: row.team_style,
      cognitive_score: row.cognitive_score,
      cognitive_tier: row.cognitive_tier,
      cognitive_profile: row.cognitive_profile,
      interests: row.interests as { key: string; weight: number }[],
      ...hollandFor(row.interests as { key: string; weight: number }[]),
      career_matches: row.career_matches as CareerResultDTO["career_matches"],
      university_matches: row.university_matches as CareerResultDTO["university_matches"],
      strengths: row.strengths as string[],
      improvements: row.improvements as string[],
      recommended_skills: recommendedSkills,
      created_at: row.created_at,
      joined_community: joinedCommunity,
    };
  });

export const getMyCareerResult = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CareerResultDTO | null> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("career_assessment_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: data.id,
      personality_type: data.personality_type,
      work_style: data.work_style,
      leadership_style: data.leadership_style,
      learning_style: data.learning_style,
      team_style: data.team_style,
      cognitive_score: data.cognitive_score,
      cognitive_tier: data.cognitive_tier,
      cognitive_profile: data.cognitive_profile,
      interests: data.interests as { key: string; weight: number }[],
      ...hollandFor(data.interests as { key: string; weight: number }[]),
      career_matches: data.career_matches as CareerResultDTO["career_matches"],
      university_matches: data.university_matches as CareerResultDTO["university_matches"],
      strengths: data.strengths as string[],
      improvements: data.improvements as string[],
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
    const { data: school } = await supabase
      .from("schools")
      .select("id")
      .eq("owner_user_id", userId)
      .maybeSingle();
    if (!school) throw new Error("not_principal");

    const { data: members } = await supabase
      .from("school_members")
      .select("user_id, role, class_id")
      .eq("school_id", school.id)
      .eq("role", "student");

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
      supabase.from("school_classes").select("id, name").eq("school_id", school.id),
      userIds.length
        ? supabase.from("profiles").select("id, name, surname").in("id", userIds)
        : Promise.resolve({ data: [] as NameRow[] }),
      userIds.length
        ? supabase.from("career_assessment_results").select("*").in("user_id", userIds)
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
        cognitiveCounts[r.cognitive_tier] = (cognitiveCounts[r.cognitive_tier] ?? 0) + 1;
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
        cognitive_profile: r?.cognitive_profile ?? null,
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
    const { data: school } = await supabase
      .from("schools")
      .select("id")
      .eq("owner_user_id", userId)
      .maybeSingle();
    if (!school) throw new Error("not_principal");

    type MatchEntry = { name: string; category: string; score: number };
    type StudentEntry = { user_id: string; name: string; matches: MatchEntry[] };

    const overview = await (async (): Promise<{ students: StudentEntry[] }> => {
      // inline minimal fetch
      const { data: members } = await supabase
        .from("school_members")
        .select("user_id, role")
        .eq("school_id", school.id)
        .eq("role", "student");
      const userIds = (members ?? []).map((m) => m.user_id);
      if (!userIds.length) return { students: [] };
      const [profilesRes, resultsRes] = await Promise.all([
        supabase.from("profiles").select("id, name, surname").in("id", userIds),
        supabase.from("career_assessment_results").select("*").in("user_id", userIds),
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
      const { data: id } = await supabase.rpc("school_save_specialized_class", {
        _school: school.id,
        _title: `${data.focusCategory} Class`,
        _focus: data.focusCategory,
        _focus_key: data.focusCategory.toLowerCase(),
        _reason: `Auto-built from Career Intelligence data; top ${ranked.length} students by ${data.focusCategory} fit.`,
        _students: ranked.map((r) => r.user_id),
      });
      savedId = (id as string | null) ?? null;
    }

    return {
      focus: data.focusCategory,
      students: ranked.map((r) => ({ user_id: r.user_id, name: r.name, score: r.score })),
      savedId,
    };
  });
