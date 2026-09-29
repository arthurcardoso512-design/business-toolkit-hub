import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/qr-personalizado")({
  component: QrPersonalizadoRoute,
});

function QrPersonalizadoRoute() {
  return <ToolWorkspace slug="qr-personalizado" />;
}
