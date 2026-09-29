import { Crown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-premium/12 px-2.5 py-1 text-xs font-semibold text-premium",
        className,
      )}
    >
      <Crown className="h-3.5 w-3.5" aria-hidden="true" />
      Premium
    </span>
  );
}

export function FreeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success",
        className,
      )}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      Grátis
    </span>
  );
}

type Tone = "success" | "warning" | "muted" | "destructive" | "premium";

const toneClass: Record<Tone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/18 text-warning-foreground",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/12 text-destructive",
  premium: "bg-premium/12 text-premium",
};

export function StatusBadge({ tone = "muted", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[tone])}>
      {children}
    </span>
  );
}
