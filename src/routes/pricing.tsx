import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/pricing")({
  head: () =>
    pageMeta(
      "/pricing",
      "Student and school pricing",
      "Student tools are free. School onboarding and support are agreed directly.",
    ),
  component: () => <EditorialPage kind="pricing" />,
});
