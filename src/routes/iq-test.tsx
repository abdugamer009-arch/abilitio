import { createFileRoute, redirect } from "@tanstack/react-router";

// The standalone 40-question IQ test was retired: cognitive ability is now the
// first section of the single career assessment (IQ → personality → interests).
// The path stays alive so old links and bookmarks land in the right place.
export const Route = createFileRoute("/iq-test")({
  beforeLoad: () => {
    throw redirect({ to: "/career-assessment" });
  },
  component: () => null,
});
