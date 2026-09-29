import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/orcamento")({
  component: OrcamentoRoute,
});

function OrcamentoRoute() {
  return <ToolWorkspace slug="orcamento" />;
}
