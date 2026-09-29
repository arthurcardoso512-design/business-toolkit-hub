import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Smartphone, Zap } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { ToolCard } from "@/components/tool-card";
import { ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { useTools } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HUB — Seu negócio. Suas ferramentas. Um só lugar." },
      {
        name: "description",
        content:
          "Crie links de WhatsApp, QR Codes, orçamentos e sua presença digital em poucos cliques. Comece grátis.",
      },
      { property: "og:title", content: "HUB — Seu negócio. Suas ferramentas. Um só lugar." },
      {
        property: "og:description",
        content: "Ferramentas simples para criar, divulgar e atender seus clientes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const BENEFITS = [
  { icon: Zap, title: "Pronto em segundos", text: "Preencha, gere e use. Sem complicação." },
  { icon: Smartphone, title: "Funciona no celular", text: "Feito para usar no balcão ou na rua." },
  { icon: ShieldCheck, title: "Seus dados protegidos", text: "Cada recurso pertence só a você." },
];

function Home() {
  const { data: tools, isLoading, error, refetch } = useTools();

  return (
    <PageShell>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl leading-tight font-semibold md:text-5xl">
              Seu negócio. Suas ferramentas. Um só lugar.
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Ferramentas simples para criar, divulgar e atender seus clientes de forma mais
              profissional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/auth" search={{ modo: "cadastro" }}>
                  Começar grátis
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/ferramentas">Ver ferramentas</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="surface-card p-5">
                <b.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-sm font-semibold">{b.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-semibold">O que você precisa criar hoje?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          As ferramentas marcadas como Grátis podem ser usadas sem pagar nada.
        </p>

        {isLoading ? (
          <LoadingState label="Carregando ferramentas..." />
        ) : error ? (
          <div className="mt-6">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(tools ?? []).slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/ferramentas">Ver todas as ferramentas</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
