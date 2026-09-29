import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/link-bio")({
  component: LinkBioRoute,
});

function LinkBioRoute() {
  return <ToolWorkspace slug="link-bio" />;
}
