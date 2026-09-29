import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/qr-pix")({
  component: QrPixRoute,
});

function QrPixRoute() {
  return <ToolWorkspace slug="qr-pix" />;
}
