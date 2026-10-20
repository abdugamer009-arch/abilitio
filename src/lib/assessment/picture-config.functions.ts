import { createServerFn } from "@tanstack/react-start";
export const getPictureAssessmentMode = createServerFn({ method: "GET" }).handler(async () => {
  const { pictureAssessmentEnabled } = await import("./picture-config.server");
  return { enabled: pictureAssessmentEnabled() };
});
