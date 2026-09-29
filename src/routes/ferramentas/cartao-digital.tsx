import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/tool-workspace";

export const Route = createFileRoute("/ferramentas/cartao-digital")({
  component: CartaoDigitalRoute,
});

function CartaoDigitalRoute() {
  return <ToolWorkspace slug="cartao-digital" />;
}
