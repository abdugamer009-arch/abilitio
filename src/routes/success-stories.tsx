import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/success-stories")({
  head: () =>
    pageMeta(
      "/success-stories",
      "Evidence and case studies",
      "How Abilitio will document real, consented student experiences.",
    ),
  component: () => <EditorialPage kind="success-stories" />,
});
