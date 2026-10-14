import type { Gender } from "./attempt-profile";

export type GenderRule = {
  action: "normal" | "weight" | "exclude" | "wording";
  factor?: number;
  labels?: Partial<Record<"en" | "ru" | "uz", string>>;
};
export type ResultRule = Record<Gender, GenderRule>;
// Neutral factor 1 preserves preference-based scores. No profession is excluded by default.
// Edit one gender to { action: "weight", factor: 0.9 } or { action: "exclude" }.
const normal = (): ResultRule => ({
  male: { action: "weight", factor: 1 },
  female: { action: "weight", factor: 1 },
});
export const resultRules: Record<string, ResultRule> = {
  software_engineer: normal(), // Equal opportunity; neutral scoring.
  data_scientist: normal(), // Equal opportunity; neutral scoring.
  ai_engineer: normal(), // Equal opportunity; neutral scoring.
  cybersecurity: normal(), // Equal opportunity; neutral scoring.
  product_manager: normal(), // Equal opportunity; neutral scoring.
  mech_engineer: normal(), // Equal opportunity; neutral scoring.
  civil_engineer: normal(), // Equal opportunity; neutral scoring.
  electrical_engineer: normal(), // Equal opportunity; neutral scoring.
  aerospace_engineer: normal(), // Equal opportunity; neutral scoring.
  biomedical_engineer: normal(), // Equal opportunity; neutral scoring.
  physician: normal(), // Equal opportunity; neutral scoring.
  surgeon: normal(), // Equal opportunity; neutral scoring.
  nurse: normal(), // Equal opportunity; neutral scoring.
  pharmacist: normal(), // Equal opportunity; neutral scoring.
  psychologist: normal(), // Equal opportunity; neutral scoring.
  research_scientist: normal(), // Equal opportunity; neutral scoring.
  biologist: normal(), // Equal opportunity; neutral scoring.
  chemist: normal(), // Equal opportunity; neutral scoring.
  physicist: normal(), // Equal opportunity; neutral scoring.
  environmental_scientist: normal(), // Equal opportunity; neutral scoring.
  business_analyst: normal(), // Equal opportunity; neutral scoring.
  mgmt_consultant: normal(), // Equal opportunity; neutral scoring.
  entrepreneur: normal(), // Equal opportunity; neutral scoring.
  financial_analyst: normal(), // Equal opportunity; neutral scoring.
  investment_banker: normal(), // Equal opportunity; neutral scoring.
  accountant: normal(), // Equal opportunity; neutral scoring.
  marketing_manager: normal(), // Equal opportunity; neutral scoring.
  ux_designer: normal(), // Equal opportunity; neutral scoring.
  graphic_designer: normal(), // Equal opportunity; neutral scoring.
  architect: normal(), // Equal opportunity; neutral scoring.
  journalist: normal(), // Equal opportunity; neutral scoring.
  lawyer: normal(), // Equal opportunity; neutral scoring.
  teacher: normal(), // Equal opportunity; neutral scoring.
  professor: normal(), // Equal opportunity; neutral scoring.
  diplomat: normal(), // Equal opportunity; neutral scoring.
  athlete: normal(), // Equal opportunity; neutral scoring.
  coach: normal(), // Equal opportunity; neutral scoring.
  film_director: normal(), // Equal opportunity; neutral scoring.
  musician: normal(), // Equal opportunity; neutral scoring.
  policy_analyst: normal(), // Equal opportunity; neutral scoring.
  frontend_developer: normal(), // Equal opportunity; neutral scoring.
  mobile_developer: normal(), // Equal opportunity; neutral scoring.
  devops_engineer: normal(), // Equal opportunity; neutral scoring.
  cloud_architect: normal(), // Equal opportunity; neutral scoring.
  data_engineer: normal(), // Equal opportunity; neutral scoring.
  game_developer: normal(), // Equal opportunity; neutral scoring.
  qa_engineer: normal(), // Equal opportunity; neutral scoring.
  database_admin: normal(), // Equal opportunity; neutral scoring.
  network_engineer: normal(), // Equal opportunity; neutral scoring.
  it_support: normal(), // Equal opportunity; neutral scoring.
  blockchain_developer: normal(), // Equal opportunity; neutral scoring.
  robotics_engineer: normal(), // Equal opportunity; neutral scoring.
  chemical_engineer: normal(), // Equal opportunity; neutral scoring.
  industrial_engineer: normal(), // Equal opportunity; neutral scoring.
  petroleum_engineer: normal(), // Equal opportunity; neutral scoring.
  mining_engineer: normal(), // Equal opportunity; neutral scoring.
  automotive_engineer: normal(), // Equal opportunity; neutral scoring.
  energy_engineer: normal(), // Equal opportunity; neutral scoring.
  mechatronics_engineer: normal(), // Equal opportunity; neutral scoring.
  environmental_engineer: normal(), // Equal opportunity; neutral scoring.
  agricultural_engineer: normal(), // Equal opportunity; neutral scoring.
  materials_engineer: normal(), // Equal opportunity; neutral scoring.
  dentist: normal(), // Equal opportunity; neutral scoring.
  veterinarian: normal(), // Equal opportunity; neutral scoring.
  physical_therapist: normal(), // Equal opportunity; neutral scoring.
  dietitian: normal(), // Equal opportunity; neutral scoring.
  paramedic: normal(), // Equal opportunity; neutral scoring.
  medical_lab_tech: normal(), // Equal opportunity; neutral scoring.
  psychiatrist: normal(), // Equal opportunity; neutral scoring.
  optometrist: normal(), // Equal opportunity; neutral scoring.
  speech_therapist: normal(), // Equal opportunity; neutral scoring.
  occupational_therapist: normal(), // Equal opportunity; neutral scoring.
  midwife: normal(), // Equal opportunity; neutral scoring.
  radiologic_tech: normal(), // Equal opportunity; neutral scoring.
  geologist: normal(), // Equal opportunity; neutral scoring.
  astronomer: normal(), // Equal opportunity; neutral scoring.
  mathematician: normal(), // Equal opportunity; neutral scoring.
  statistician: normal(), // Equal opportunity; neutral scoring.
  marine_biologist: normal(), // Equal opportunity; neutral scoring.
  meteorologist: normal(), // Equal opportunity; neutral scoring.
  geneticist: normal(), // Equal opportunity; neutral scoring.
  neuroscientist: normal(), // Equal opportunity; neutral scoring.
  archaeologist: normal(), // Equal opportunity; neutral scoring.
  food_scientist: normal(), // Equal opportunity; neutral scoring.
  hr_manager: normal(), // Equal opportunity; neutral scoring.
  operations_manager: normal(), // Equal opportunity; neutral scoring.
  project_manager: normal(), // Equal opportunity; neutral scoring.
  supply_chain_manager: normal(), // Equal opportunity; neutral scoring.
  sales_manager: normal(), // Equal opportunity; neutral scoring.
  real_estate_agent: normal(), // Equal opportunity; neutral scoring.
  business_dev: normal(), // Equal opportunity; neutral scoring.
  economist: normal(), // Equal opportunity; neutral scoring.
  actuary: normal(), // Equal opportunity; neutral scoring.
  auditor: normal(), // Equal opportunity; neutral scoring.
  tax_advisor: normal(), // Equal opportunity; neutral scoring.
  insurance_underwriter: normal(), // Equal opportunity; neutral scoring.
  quant_analyst: normal(), // Equal opportunity; neutral scoring.
  digital_marketer: normal(), // Equal opportunity; neutral scoring.
  smm_manager: normal(), // Equal opportunity; neutral scoring.
  pr_specialist: normal(), // Equal opportunity; neutral scoring.
  copywriter: normal(), // Equal opportunity; neutral scoring.
  brand_manager: normal(), // Equal opportunity; neutral scoring.
  seo_specialist: normal(), // Equal opportunity; neutral scoring.
  content_creator: normal(), // Equal opportunity; neutral scoring.
  video_editor: normal(), // Equal opportunity; neutral scoring.
  photographer: normal(), // Equal opportunity; neutral scoring.
  translator: normal(), // Equal opportunity; neutral scoring.
  tv_presenter: normal(), // Equal opportunity; neutral scoring.
  editor_publisher: normal(), // Equal opportunity; neutral scoring.
  interior_designer: normal(), // Equal opportunity; neutral scoring.
  fashion_designer: normal(), // Equal opportunity; neutral scoring.
  industrial_designer: normal(), // Equal opportunity; neutral scoring.
  animator: normal(), // Equal opportunity; neutral scoring.
  illustrator: normal(), // Equal opportunity; neutral scoring.
  game_designer: normal(), // Equal opportunity; neutral scoring.
  art_director: normal(), // Equal opportunity; neutral scoring.
  actor: normal(), // Equal opportunity; neutral scoring.
  dancer: normal(), // Equal opportunity; neutral scoring.
  chef: normal(), // Equal opportunity; neutral scoring.
  pastry_chef: normal(), // Equal opportunity; neutral scoring.
  school_counselor: normal(), // Equal opportunity; neutral scoring.
  special_ed_teacher: normal(), // Equal opportunity; neutral scoring.
  kindergarten_teacher: normal(), // Equal opportunity; neutral scoring.
  librarian: normal(), // Equal opportunity; neutral scoring.
  social_worker: normal(), // Equal opportunity; neutral scoring.
  linguist: normal(), // Equal opportunity; neutral scoring.
  historian: normal(), // Equal opportunity; neutral scoring.
  sociologist: normal(), // Equal opportunity; neutral scoring.
  prosecutor: normal(), // Equal opportunity; neutral scoring.
  notary: normal(), // Equal opportunity; neutral scoring.
  detective: normal(), // Equal opportunity; neutral scoring.
  police_officer: normal(), // Equal opportunity; neutral scoring.
  firefighter: normal(), // Equal opportunity; neutral scoring.
  military_officer: normal(), // Equal opportunity; neutral scoring.
  urban_planner: normal(), // Equal opportunity; neutral scoring.
  public_administrator: normal(), // Equal opportunity; neutral scoring.
  ngo_manager: normal(), // Equal opportunity; neutral scoring.
  electrician: normal(), // Equal opportunity; neutral scoring.
  plumber: normal(), // Equal opportunity; neutral scoring.
  carpenter: normal(), // Equal opportunity; neutral scoring.
  welder: normal(), // Equal opportunity; neutral scoring.
  auto_mechanic: normal(), // Equal opportunity; neutral scoring.
  hvac_technician: normal(), // Equal opportunity; neutral scoring.
  construction_manager: normal(), // Equal opportunity; neutral scoring.
  surveyor: normal(), // Equal opportunity; neutral scoring.
  pilot: normal(), // Equal opportunity; neutral scoring.
  air_traffic_controller: normal(), // Equal opportunity; neutral scoring.
  flight_attendant: normal(), // Equal opportunity; neutral scoring.
  maritime_officer: normal(), // Equal opportunity; neutral scoring.
  logistics_coordinator: normal(), // Equal opportunity; neutral scoring.
  agronomist: normal(), // Equal opportunity; neutral scoring.
  agribusiness_manager: normal(), // Equal opportunity; neutral scoring.
  forester: normal(), // Equal opportunity; neutral scoring.
  landscape_architect: normal(), // Equal opportunity; neutral scoring.
  hotel_manager: normal(), // Equal opportunity; neutral scoring.
  event_planner: normal(), // Equal opportunity; neutral scoring.
  tour_guide: normal(), // Equal opportunity; neutral scoring.
  restaurant_manager: normal(), // Equal opportunity; neutral scoring.
  personal_trainer: normal(), // Equal opportunity; neutral scoring.
  sports_analyst: normal(), // Equal opportunity; neutral scoring.
  physiotherapist_sport: normal(), // Equal opportunity; neutral scoring.
  esports_professional: normal(), // Equal opportunity; neutral scoring.
  startup_product_designer: normal(), // Equal opportunity; neutral scoring.
  ecommerce_founder: normal(), // Equal opportunity; neutral scoring.
  franchise_owner: normal(), // Equal opportunity; neutral scoring.
  social_entrepreneur: normal(), // Equal opportunity; neutral scoring.
};
// Grammatical wording only, never evidence of different ability or interests.
resultRules.actor = {
  male: { action: "wording", labels: { en: "Actor", ru: "Актёр", uz: "Aktyor" } },
  female: { action: "wording", labels: { en: "Actress", ru: "Актриса", uz: "Aktrisa" } },
};
resultRules.teacher = {
  male: { action: "wording", labels: { ru: "Учитель" } },
  female: { action: "wording", labels: { ru: "Учительница" } },
};
resultRules.dancer = {
  male: { action: "wording", labels: { ru: "Танцовщик" } },
  female: { action: "wording", labels: { ru: "Танцовщица" } },
};

export function applyResultRules<T extends { key: string; name: string; score: number }>(
  matches: T[],
  gender: Gender,
  lang: "en" | "ru" | "uz",
  rules = resultRules,
): T[] {
  const valid = matches.filter((m) => m.key && m.name && Number.isFinite(m.score));
  const ranked = valid
    .flatMap((m) => {
      const rule = rules[m.key]?.[gender] ?? { action: "normal" };
      if (rule.action === "exclude") return [];
      const factor =
        rule.action === "weight" && Number.isFinite(rule.factor)
          ? Math.max(0, Math.min(1, rule.factor!))
          : 1;
      return [
        {
          ...m,
          score: Math.round(m.score * factor * 100) / 100,
          name: rule.labels?.[lang] ?? m.name,
        },
      ];
    })
    .sort((a, b) => b.score - a.score);
  // If every result is excluded, use the highest original valid candidate.
  if (ranked.length) return ranked;
  if (valid.length) return valid.sort((a, b) => b.score - a.score).slice(0, 1);
  const labels = {
    en: "Explore your interests",
    ru: "Исследуй свои интересы",
    uz: "Qiziqishlaringni kashf qil",
  };
  return [
    {
      key: "exploring",
      name: labels[lang],
      category: "Exploration",
      score: 0,
      matchFields: [],
      major: null,
    } as unknown as T,
  ];
}
