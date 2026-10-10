import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/for-schools")({
  head: () =>
    pageMeta(
      "/for-schools",
      "Career conversations at school",
      "Assessment, discussion and small career experiments for students. Plan a school pilot.",
    ),
  component: () => <EditorialPage kind="for-schools" />,
});
