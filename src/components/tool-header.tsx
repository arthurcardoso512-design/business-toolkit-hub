import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolHeader({
  eyebrow,
  title,
  description,
  icon,
  badge,
  backTo = "/ferramentas",
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  badge?: ReactNode;
  backTo?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to={backTo}>
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Voltar para ferramentas
        </Link>
      </Button>

      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-primary">{eyebrow}</p>
            {badge}
          </div>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
