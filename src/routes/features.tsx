import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/features")({
  head: () =>
    pageMeta(
      "/features",
      "The assessment",
      "Explore how the thirty-question profile connects reasoning, work preferences and interests.",
    ),
  component: () => <EditorialPage kind="features" />,
});
