import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/lib/queries";

export const Route = createFileRoute("/planos")({ component: PlansPage });

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PlansPage() {
  const { data: plans, isLoading, error, refetch } = usePlans();

  return (
    <PageShell>
      <section className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-premium/12 text-premium">
            <Crown className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Planos simples e transparentes</h1>
          <p className="mt-3 text-muted-foreground">
            Escolha o período que fizer sentido para o seu negócio. O pagamento será integrado na próxima etapa.
          </p>
        </div>

        {isLoading ? (
          <LoadingState label="Carregando planos..." />
        ) : error ? (
          <div className="mx-auto mt-8 max-w-md"><ErrorState onRetry={() => refetch()} /></div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {(plans ?? []).map((plan) => (
              <article key={plan.id} className="surface-card flex flex-col p-6">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <div className="mt-4 text-3xl font-semibold">{plan.price > 0 ? formatPrice(plan.price) : "Em definição"}</div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.duration_days} dias de acesso</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Acesso às ferramentas Premium</li>
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Uso simples e direto</li>
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Dados vinculados à sua conta</li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to="/auth" search={{ modo: "cadastro" }}>Começar</Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
