import { createFileRoute } from "@tanstack/react-router";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/mentors")({
  head: () =>
    pageMeta("/mentors", "Mentors", "Our mentor publication policy and current availability."),
  component: () => <EditorialPage kind="mentors" />,
});
