import { Link } from "@tanstack/react-router";
import { Loader2, Inbox, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground"
    >
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  children,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && actionTo ? (
        <Button asChild className="mt-2">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      ) : null}
      {children}
    </div>
  );
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não conseguimos carregar estas informações agora. Tente novamente.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-10 text-center">
      <TriangleAlert className="h-7 w-7 text-destructive" aria-hidden="true" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-2" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
