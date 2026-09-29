import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ToolCard } from "@/components/tool-card";
import { ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { usePlans, useTools } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bizi — ferramentas simples para negócios reais" },
    { name: "description", content: "Ferramentas simples para negócios reais: WhatsApp, QR Code, divulgação e muito mais." },
    { property: "og:title", content: "Bizi — ferramentas simples para negócios reais" },
    { property: "og:description", content: "Ferramentas simples para criar, divulgar e atender seus clientes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Home,
});

const BENEFITS = [
  { icon: Zap, title: "Pronto em segundos", text: "Preencha, gere e use. Sem complicação." },
  { icon: Smartphone, title: "Funciona no celular", text: "Feito para usar no balcão ou na rua." },
  { icon: ShieldCheck, title: "Seus dados protegidos", text: "Cada recurso pertence só a você." },
];

function Home() {
  const { data: tools, isLoading: toolsLoading, error: toolsError, refetch: refetchTools } = useTools();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const featuredTools = (tools ?? []).slice(0, 8);

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-border bg-surface"><div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-primary/15 blur-3xl" /><div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="container-page py-14 md:py-20">
          <div className="relative max-w-3xl bizi-reveal">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">Bizi • ferramentas simples para negócios reais</span>
            <h1 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">Tudo que seu negócio precisa para criar, divulgar e atender.</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">Ferramentas simples, rápidas e feitas para resolver tarefas reais do dia a dia.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link to="/ferramentas">Explorar ferramentas<ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/planos">Conhecer planos</Link></Button>
            </div>
          </div>
          <div className="relative mt-10 grid gap-4 sm:grid-cols-3 bizi-reveal-delay">{BENEFITS.map((b) => <div key={b.title} className="surface-card p-5"><b.icon className="h-5 w-5 text-primary" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold">{b.title}</h2><p className="mt-1 text-sm text-muted-foreground">{b.text}</p></div>)}</div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Acesso rápido</p><h2 className="mt-1 text-2xl font-semibold">Ferramentas em destaque</h2><p className="mt-2 text-sm text-muted-foreground">Comece por uma tarefa e resolva em poucos cliques.</p></div><Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/ferramentas">Ver todas</Link></Button></div>
        {toolsLoading ? <LoadingState label="Carregando ferramentas..." /> : toolsError ? <div className="mt-6"><ErrorState onRetry={() => refetchTools()} /></div> : (
          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featuredTools.map((tool) => <div key={tool.id} className="w-[82vw] shrink-0 snap-start sm:w-[48%] lg:w-[31%] glow-hover"><ToolCard tool={tool} /></div>)}
          </div>
        )}
        <div className="mt-2 sm:hidden"><Button asChild variant="outline" className="w-full"><Link to="/ferramentas">Ver todas as ferramentas</Link></Button></div>
      </section>

      <section className="border-y border-border bg-surface py-12 md:py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Planos Bizi</p><h2 className="mt-1 text-2xl font-semibold">Escolha o período que fizer sentido</h2><p className="mt-2 text-sm text-muted-foreground">Acesso às ferramentas Premium, com planos simples e transparentes.</p></div><Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/planos">Ver planos</Link></Button></div>
          {plansLoading ? <LoadingState label="Carregando planos..." /> : (
            <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]">
              {(plans ?? []).map((plan) => <article key={plan.id} className="surface-card glow-hover flex w-[82vw] shrink-0 snap-start flex-col p-5 sm:w-[48%] lg:w-[31%]"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">{plan.name}</h3><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{plan.duration_days} dias</span></div><div className="mt-4 text-2xl font-semibold">{plan.price > 0 ? plan.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Em definição"}</div><ul className="mt-4 space-y-2 text-sm text-muted-foreground"><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Acesso às ferramentas Premium</li><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Uso simples e direto</li></ul><Button asChild className="mt-6 w-full"><Link to="/auth" search={{ modo: "cadastro" }}>Começar</Link></Button></article>)}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-12 md:py-16 bizi-reveal-delay-2"><div className="surface-card flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8"><div><p className="text-sm font-semibold text-primary">Bizi</p><h2 className="mt-1 text-2xl font-semibold">Menos complicação. Mais tempo para o seu negócio.</h2><p className="mt-2 text-sm text-muted-foreground">Ferramentas práticas para você criar, divulgar e atender melhor.</p></div><Button asChild size="lg"><Link to="/ferramentas">Começar agora<ArrowRight className="ml-1 h-4 w-4" /></Link></Button></div></section>
    </PageShell>
  );
}
