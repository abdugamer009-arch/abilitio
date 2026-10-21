import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  headers: () => ({
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  }),
  head: () =>
    pageMeta(
      "/about",
      "Our approach",
      "A career exploration project from Uzbekistan. Meet the founders and read our principles.",
    ),
  component: () => <EditorialPage kind="about" />,
});
