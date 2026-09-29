import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/placa-pix")({
  component: PlacaPixRoute,
});

function PlacaPixRoute() {
  return <ToolWorkspace slug="placa-pix" />;
}
