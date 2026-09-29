import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/link-temporario")({
  component: LinkTemporarioRoute,
});

function LinkTemporarioRoute() {
  return <ToolWorkspace slug="link-temporario" />;
}
