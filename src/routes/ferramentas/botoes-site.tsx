import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/botoes-site")({
  component: BotoesSiteRoute,
});

function BotoesSiteRoute() {
  return <ToolWorkspace slug="botoes-site" />;
}
