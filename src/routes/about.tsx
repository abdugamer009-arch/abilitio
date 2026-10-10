import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta(
      "/about",
      "Our approach",
      "A career exploration project from Uzbekistan. Meet the founders and read our principles.",
    ),
  component: () => <EditorialPage kind="about" />,
});
