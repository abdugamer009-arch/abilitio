import { it, expect } from "vitest";
import { SCHOOL_AGREEMENT, schoolAgreementReady } from "@/lib/schools/school-agreement";
it("M13 cannot enable registration with missing or unapproved responsibilities", () => {
  const original = { ...SCHOOL_AGREEMENT };
  try {
    Object.assign(SCHOOL_AGREEMENT, {
      approved: false,
      scope: null,
      payer: null,
      studentPermissions: null,
    });
    expect(schoolAgreementReady()).toBe(false);
    Object.assign(SCHOOL_AGREEMENT, {
      approved: true,
      scope: "Reviewed fixture scope",
      payer: "Reviewed fixture payer",
    });
    expect(schoolAgreementReady()).toBe(false);
    SCHOOL_AGREEMENT.studentPermissions = "Reviewed fixture responsibilities";
    expect(schoolAgreementReady()).toBe(true);
    SCHOOL_AGREEMENT.approved = false;
    expect(schoolAgreementReady()).toBe(false);
  } finally {
    Object.assign(SCHOOL_AGREEMENT, original);
  }
});
