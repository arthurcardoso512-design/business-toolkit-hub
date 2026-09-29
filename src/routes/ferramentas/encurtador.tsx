import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/encurtador")({
  component: EncurtadorRoute,
});

function EncurtadorRoute() {
  return <ToolWorkspace slug="encurtador" />;
}
