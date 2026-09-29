import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/qr-dinamico")({
  component: QrDinamicoRoute,
});

function QrDinamicoRoute() {
  return <ToolWorkspace slug="qr-dinamico" />;
}
