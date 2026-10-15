// Owner-reviewed school terms only. Do not replace these with invented prices.
export const SCHOOL_AGREEMENT: {
  approved: boolean;
  scope: string | null;
  payer: string | null;
  studentPermissions: string | null;
} = { approved: false, scope: null, payer: null, studentPermissions: null };
export function schoolAgreementReady() {
  return (
    SCHOOL_AGREEMENT.approved &&
    Boolean(SCHOOL_AGREEMENT.scope && SCHOOL_AGREEMENT.payer && SCHOOL_AGREEMENT.studentPermissions)
  );
}
