import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/recibo")({
  component: ReciboRoute,
});

function ReciboRoute() {
  return <ToolWorkspace slug="recibo" />;
}
