import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/methodology")({
  headers: () => ({
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  }),
  head: () =>
    pageMeta(
      "/methodology",
      "Methodology and limits",
      "Question counts, scoring scales, career suggestions and the limits of an exploratory profile.",
    ),
  component: () => <EditorialPage kind="methodology" />,
});
