import { Link } from "@tanstack/react-router";
import {
  Banknote,
  FileText,
  Frame,
  IdCard,
  Link2,
  MessageCircle,
  MousePointerClick,
  Palette,
  QrCode,
  ReceiptText,
  RefreshCw,
  Scissors,
  Timer,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { FreeBadge, PremiumBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { TOOL_ICONS, TOOL_ROUTES } from "@/lib/tools-catalog";

const ICONS: Record<string, LucideIcon> = {
  MessageCircle,
  Link2,
  Timer,
  Scissors,
  MousePointerClick,
  QrCode,
  Palette,
  RefreshCw,
  Wifi,
  Banknote,
  Frame,
  FileText,
  ReceiptText,
  IdCard,
};

export type ToolRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  is_free: boolean;
};

export function ToolCard({ tool }: { tool: ToolRow }) {
  const Icon = ICONS[TOOL_ICONS[tool.slug] ?? ""] ?? Wrench;
  const href = TOOL_ROUTES[tool.slug] ?? null;

  return (
    <article className="surface-card flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {tool.is_free ? <FreeBadge /> : <PremiumBadge />}
      </div>

      <div className="flex-1 space-y-1.5">
        <h3 className="text-base font-semibold">{tool.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      </div>

      {href ? (
        <Button asChild size="sm" className="w-full">
          <Link to={href}>Usar ferramenta</Link>
        </Button>
      ) : tool.is_free ? (
        <Button size="sm" variant="secondary" className="w-full" disabled>
          Em breve
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/planos">Conhecer Premium</Link>
        </Button>
      )}
    </article>
  );
}
