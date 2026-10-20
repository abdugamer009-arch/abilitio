/** A puzzle approval is not a production rollout approval. Both flags default off. */
export function pictureAssessmentEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return (
    env.ASSESSMENT_PICTURE_ENABLED === "true" &&
    (env.NODE_ENV !== "production" || env.ASSESSMENT_PICTURE_ROLLOUT_APPROVED === "true")
  );
}
