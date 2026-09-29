import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/$toolSlug")({
  component: ToolWorkspacePage,
});

function ToolWorkspacePage() {
  const { toolSlug } = Route.useParams();
  return <ToolWorkspace slug={toolSlug} />;
}
