import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SchoolDTO = {
  id: string;
  code: string;
  name: string;
  principal_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  student_count_estimate: number;
  plan: "starter" | "professional" | "enterprise";
  owner_user_id: string;
  created_at: string;
};

export type ClassDTO = { id: string; name: string; grade: number | null };
export type MemberDTO = {
  user_id: string;
  role: "principal" | "teacher" | "student";
  class_id: string | null;
  name: string;
  surname: string;
};
export type SchoolContextDTO = {
  role: "principal" | "teacher" | "student" | null;
  school: SchoolDTO | null;
  class: ClassDTO | null;
};

const careerBuckets: Record<string, string> = {
  "Software Engineer": "technology",
  "Data Analyst": "technology",
  "Research Scientist": "research",
  "UX / Product Designer": "creative",
  "Graphic Designer": "creative",
  "Journalist": "communication",
  "Marketing Manager": "business",
  "Public Relations Specialist": "communication",
  "Entrepreneur / Startup Founder": "leadership",
  "Product Manager": "leadership",
  "Teacher / Educator": "communication",
  "Psychologist": "medical",
  "Content Creator": "creative",
  "Civil Engineer / Architect": "engineering",
  "Financial Analyst": "business",
  "Doctor / Healthcare Professional": "medical",
  "Lawyer": "communication",
  "Operations Manager": "leadership",
};
export const BUCKET_LABELS: Record<string, string> = {
  engineering: "Engineering",
  business: "Business",
  medical: "Medical",
  creative: "Creative",
  communication: "Communication",
  research: "Research",
  technology: "Technology",
  leadership: "Leadership",
};
function bucketOf(careerName: string): string {
  return careerBuckets[careerName] ?? "research";
}

export const registerSchool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    name: string; principalName: string; email: string; phone?: string;
    students: number; city?: string; country?: string;
  }) => z.object({
    name: z.string().trim().min(2).max(200),
    principalName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(40).optional().default(""),
    students: z.number().int().min(0).max(100000),
    city: z.string().trim().max(120).optional().default(""),
    country: z.string().trim().max(120).optional().default(""),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: school, error } = await supabase.rpc("register_school", {
      _name: data.name,
      _principal_name: data.principalName,
      _email: data.email,
      _phone: data.phone ?? "",
      _students: data.students,
      _city: data.city ?? "",
      _country: data.country ?? "",
    });
    if (error) throw new Error(error.message);
    return { school: school as SchoolDTO };
  });

export const joinSchool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string; className: string }) =>
    z.object({
      code: z.string().trim().min(4).max(40),
      className: z.string().trim().min(1).max(16).regex(/^[A-Za-z0-9\- ]+$/),
    }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: schoolId, error } = await supabase.rpc("join_school", {
      _code: data.code.toUpperCase(),
      _class_name: data.className.toUpperCase(),
    });
    if (error) throw new Error(error.message);
    return { schoolId: schoolId as string };
  });

export const getMySchoolContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SchoolContextDTO> => {
    const { supabase, userId } = context;
    const { data: membership } = await supabase
      .from("school_members")
      .select("role, class_id, school_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!membership) return { role: null, school: null, class: null };
    const { data: school } = await supabase
      .from("schools").select("*").eq("id", membership.school_id).maybeSingle();
    let klass: ClassDTO | null = null;
    if (membership.class_id) {
      const { data: c } = await supabase
        .from("school_classes").select("id, name, grade").eq("id", membership.class_id).maybeSingle();
      klass = (c as ClassDTO) ?? null;
    }
    return {
      role: membership.role as SchoolContextDTO["role"],
      school: school as SchoolDTO ?? null,
      class: klass,
    };
  });

type StudentRow = {
  user_id: string;
  name: string;
  surname: string;
  class_id: string | null;
  class_name: string | null;
  top_career: string | null;
  bucket: string | null;
  mbti: string | null;
  iq: number | null;
  strengths: string[];
};

async function loadPrincipalSchool(supabase: any, userId: string) {
  const { data: school } = await supabase
    .from("schools").select("*").eq("owner_user_id", userId).maybeSingle();
  if (!school) throw new Error("not_principal");
  return school as SchoolDTO;
}

async function loadStudentsForSchool(school: SchoolDTO): Promise<{
  classes: ClassDTO[]; students: StudentRow[];
}> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: classes } = await supabaseAdmin
    .from("school_classes").select("id, name, grade").eq("school_id", school.id).order("name");
  const { data: members } = await supabaseAdmin
    .from("school_members").select("user_id, class_id")
    .eq("school_id", school.id).eq("role", "student");
  const studentIds = (members ?? []).map((m: any) => m.user_id);
  const classMap = new Map<string, ClassDTO>((classes ?? []).map((c: any) => [c.id, c]));
  if (!studentIds.length) return { classes: (classes ?? []) as ClassDTO[], students: [] };
  const [{ data: profiles }, { data: results }] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, name, surname").in("id", studentIds),
    supabaseAdmin.from("assessment_results").select("user_id, careers, mbti_type, iq_score, top_strengths, created_at").in("user_id", studentIds),
  ]);
  const profMap = new Map<string, any>((profiles ?? []).map((p: any) => [p.id, p]));
  const latestResult = new Map<string, any>();
  for (const r of (results ?? []) as any[]) {
    const prev = latestResult.get(r.user_id);
    if (!prev || new Date(r.created_at) > new Date(prev.created_at)) latestResult.set(r.user_id, r);
  }
  const students: StudentRow[] = (members ?? []).map((m: any) => {
    const p = profMap.get(m.user_id);
    const r = latestResult.get(m.user_id);
    const topCareer = r?.careers?.[0]?.name ?? null;
    const klass = m.class_id ? classMap.get(m.class_id) : null;
    return {
      user_id: m.user_id,
      name: p?.name ?? "Student",
      surname: p?.surname ?? "",
      class_id: m.class_id,
      class_name: klass?.name ?? null,
      top_career: topCareer,
      bucket: topCareer ? bucketOf(topCareer) : null,
      mbti: r?.mbti_type ?? null,
      iq: r?.iq_score ?? null,
      strengths: Array.isArray(r?.top_strengths) ? r.top_strengths : [],
    };
  });
  return { classes: (classes ?? []) as ClassDTO[], students };
}

export type PrincipalDashboardDTO = {
  school: SchoolDTO;
  totals: { students: number; classes: number; completed: number; completionRate: number };
  bucketDistribution: { bucket: string; label: string; count: number }[];
  careerDistribution: { name: string; count: number }[];
  classBreakdown: {
    classId: string; className: string; total: number;
    buckets: { bucket: string; label: string; count: number }[];
  }[];
  topTalents: { dimension: string; students: { user_id: string; name: string; score: number }[] }[];
  insights: string[];
  students: StudentRow[];
};

export const getPrincipalDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PrincipalDashboardDTO> => {
    const school = await loadPrincipalSchool(context.supabase, context.userId);
    const { classes, students } = await loadStudentsForSchool(school);
    const completed = students.filter((s) => s.top_career).length;
    const completionRate = students.length ? Math.round((completed / students.length) * 100) : 0;

    const bucketCounts = new Map<string, number>();
    const careerCounts = new Map<string, number>();
    for (const s of students) {
      if (s.bucket) bucketCounts.set(s.bucket, (bucketCounts.get(s.bucket) ?? 0) + 1);
      if (s.top_career) careerCounts.set(s.top_career, (careerCounts.get(s.top_career) ?? 0) + 1);
    }
    const bucketDistribution = Object.keys(BUCKET_LABELS).map((b) => ({
      bucket: b, label: BUCKET_LABELS[b], count: bucketCounts.get(b) ?? 0,
    }));
    const careerDistribution = Array.from(careerCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const classBreakdown = classes.map((c) => {
      const inClass = students.filter((s) => s.class_id === c.id);
      const buckets = Object.keys(BUCKET_LABELS).map((b) => ({
        bucket: b, label: BUCKET_LABELS[b],
        count: inClass.filter((s) => s.bucket === b).length,
      }));
      return { classId: c.id, className: c.name, total: inClass.length, buckets };
    });

    // Top talents (by latest assessment dims)
    const dim = (key: keyof StudentRow): { user_id: string; name: string; score: number }[] => {
      return [...students]
        .filter((s) => typeof (s as any)[key] === "number")
        .sort((a, b) => ((b as any)[key] ?? 0) - ((a as any)[key] ?? 0))
        .slice(0, 5)
        .map((s) => ({ user_id: s.user_id, name: `${s.name} ${s.surname}`.trim(), score: (s as any)[key] }));
    };
    const topByStrength = (label: string): { user_id: string; name: string; score: number }[] => {
      const matches = students.filter((s) => s.strengths.includes(label));
      return matches.slice(0, 5).map((s) => ({ user_id: s.user_id, name: `${s.name} ${s.surname}`.trim(), score: 1 }));
    };
    const topTalents = [
      { dimension: "Top Analytical Thinkers", students: dim("iq") },
      { dimension: "Top Leaders", students: topByStrength("leadership") },
      { dimension: "Top Communicators", students: topByStrength("communication") },
      { dimension: "Top Creatives", students: topByStrength("creativity") },
      { dimension: "Top Problem Solvers", students: topByStrength("analytical") },
      { dimension: "Top Researchers", students: topByStrength("curiosity") },
      { dimension: "Top Entrepreneurs", students: topByStrength("business") },
    ];

    // Insights
    const insights: string[] = [];
    const dominant = bucketDistribution.slice().sort((a, b) => b.count - a.count)[0];
    if (dominant && dominant.count > 0) {
      insights.push(`Your school has a strong concentration of ${dominant.label.toLowerCase()}-oriented students (${dominant.count}).`);
    }
    const strongClass = classBreakdown
      .map((c) => ({ name: c.className, top: c.buckets.slice().sort((a, b) => b.count - a.count)[0] }))
      .filter((c) => c.top && c.top.count >= 3)[0];
    if (strongClass) {
      insights.push(`Class ${strongClass.name} shows exceptionally strong ${strongClass.top!.label.toLowerCase()} potential.`);
    }
    if (completionRate < 60 && students.length > 0) {
      insights.push(`Only ${completionRate}% of students have completed their assessments — encourage participation for sharper insights.`);
    }
    if (!insights.length) insights.push("Invite students with your school code to unlock talent insights.");

    return {
      school,
      totals: { students: students.length, classes: classes.length, completed, completionRate },
      bucketDistribution, careerDistribution, classBreakdown, topTalents, insights, students,
    };
  });

export const generateSpecializedClasses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const school = await loadPrincipalSchool(context.supabase, context.userId);
    const { students } = await loadStudentsForSchool(school);
    const groups: Record<string, StudentRow[]> = {};
    for (const s of students) {
      if (!s.bucket) continue;
      (groups[s.bucket] ??= []).push(s);
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("school_specialized_classes").delete().eq("school_id", school.id);
    const inserts = Object.entries(groups)
      .filter(([, list]) => list.length >= 3)
      .map(([bucket, list]) => ({
        school_id: school.id,
        title: `${BUCKET_LABELS[bucket]} Class`,
        focus: bucket,
        reason: reasonFor(bucket),
        student_user_ids: list.slice(0, 30).map((s) => s.user_id),
        created_by: context.userId,
      }));
    if (inserts.length) {
      await supabaseAdmin.from("school_specialized_classes").insert(inserts);
    }
    return { created: inserts.length };
  });

function reasonFor(bucket: string): string {
  switch (bucket) {
    case "engineering": return "Strong mathematical ability, analytical thinking, engineering compatibility.";
    case "business": return "Leadership potential, communication skills, entrepreneurship indicators.";
    case "medical": return "Scientific reasoning, empathy, healthcare compatibility.";
    case "creative": return "Creativity, imagination, design potential.";
    case "communication": return "Verbal fluency, persuasion, audience awareness.";
    case "research": return "Deep curiosity, analytical rigor, comfort with ambiguity.";
    case "technology": return "Logical reasoning, technical aptitude, pattern recognition.";
    case "leadership": return "Decision-making, vision, ability to mobilize teams.";
    default: return "Strong alignment across multiple dimensions.";
  }
}

export type SpecializedClassDTO = {
  id: string; title: string; focus: string; reason: string;
  students: { user_id: string; name: string }[];
};

export const listSpecializedClasses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ classes: SpecializedClassDTO[] }> => {
    const school = await loadPrincipalSchool(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("school_specialized_classes").select("*").eq("school_id", school.id)
      .order("focus");
    const ids = Array.from(new Set((rows ?? []).flatMap((r: any) => r.student_user_ids as string[])));
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from("profiles").select("id, name, surname").in("id", ids)
      : { data: [] as any[] };
    const pmap = new Map<string, any>((profiles ?? []).map((p: any) => [p.id, p]));
    return {
      classes: (rows ?? []).map((r: any) => ({
        id: r.id, title: r.title, focus: r.focus, reason: r.reason,
        students: (r.student_user_ids as string[]).map((uid) => {
          const p = pmap.get(uid);
          return { user_id: uid, name: p ? `${p.name} ${p.surname}`.trim() : "Student" };
        }),
      })),
    };
  });
