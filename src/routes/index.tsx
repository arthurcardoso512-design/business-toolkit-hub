import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Crown, ShieldCheck, Smartphone, Sparkles, Zap } from "lucide-react";
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

const PAID_FEATURES = [
  "Acesso a todas as ferramentas Premium",
  "Recursos avançados e personalizações",
  "Ferramentas novas sem custo adicional",
  "Mais praticidade para o dia a dia",
];

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Home() {
  const { data: tools, isLoading: toolsLoading, error: toolsError, refetch: refetchTools } = useTools();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const featuredTools = (tools ?? []).slice(0, 8);
  const monthlyPlan = (plans ?? []).find((plan) => plan.slug === "mensal");
  const monthlyEquivalent = monthlyPlan?.price ?? 19.9;

  return (
    <PageShell>
      <section className="overflow-hidden border-b border-border/60 bg-background/70">
        <div className="bizi-marquee" aria-label="Bizi — ferramentas simples para negócios reais">
          <div className="bizi-marquee-track">
            <span>Bizi • ferramentas simples para negócios reais</span>
            <span>Tudo que seu negócio precisa para criar, divulgar e atender.</span>
            <span>Ferramentas simples, rápidas e feitas para resolver tarefas reais do dia a dia.</span>
            <span>Bizi • ferramentas simples para negócios reais</span>
            <span>Tudo que seu negócio precisa para criar, divulgar e atender.</span>
            <span>Ferramentas simples, rápidas e feitas para resolver tarefas reais do dia a dia.</span>
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="bizi-reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Comece por aqui</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Ferramentas para o dia a dia do seu negócio.</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Escolha uma tarefa, resolva em poucos cliques e volte para o que realmente importa: atender seus clientes e fazer o negócio acontecer.</p>
          </div>
          <Button asChild size="lg"><Link to="/ferramentas">Ver todas <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>

        <nav className="mt-7 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Categorias de ferramentas">
          {["Links", "QR Codes", "Pix", "Documentos", "Presença digital"].map((category, index) => (
            <Link key={category} to="/ferramentas" className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 ${index === 0 ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{category}</Link>
          ))}
        </nav>

        {toolsLoading ? <LoadingState label="Carregando ferramentas..." /> : toolsError ? <div className="mt-6"><ErrorState onRetry={() => refetchTools()} /></div> : (
          <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featuredTools.map((tool) => <div key={tool.id} className="w-[82vw] shrink-0 snap-start sm:w-[48%] lg:w-[31%] glow-hover"><ToolCard tool={tool} /></div>)}
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-surface/70 py-12 md:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center bizi-reveal">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Grátis x Premium</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Comece grátis. Evolua quando precisar.</h2>
            <p className="mt-3 text-muted-foreground">Use as ferramentas gratuitas sem compromisso. Quando quiser ganhar mais recursos e praticidade, escolha um plano Premium.</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="surface-card p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-sm font-semibold text-muted-foreground">Plano atual</p><h3 className="mt-1 text-2xl font-semibold">Grátis</h3></div>
                <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-bold">R$ 0,00</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Ferramentas gratuitas</li>
                <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Uso simples e direto</li>
                <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />Sem mensalidade</li>
              </ul>
              <Button asChild variant="outline" className="mt-7 w-full"><Link to="/ferramentas">Manter plano grátis</Link></Button>
            </article>

            <article className="premium-card relative overflow-hidden p-6 md:p-8">
              <div className="premium-glow" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-premium/40 bg-premium/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-premium"><Crown className="h-3.5 w-3.5" /> Premium</span>
                    <h3 className="mt-3 text-2xl font-semibold">Mais ferramentas. Mais possibilidades.</h3>
                  </div>
                  <Sparkles className="h-7 w-7 text-premium" />
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {PAID_FEATURES.map((feature) => <div key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-premium" />{feature}</div>)}
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {(plans ?? []).map((plan) => {
                    const reference = monthlyEquivalent * (plan.duration_days / 30);
                    const saving = reference - plan.price;
                    return (
                      <div key={plan.id} className="rounded-2xl border border-premium/20 bg-background/40 p-4">
                        <div className="flex items-center justify-between gap-2"><p className="font-semibold">{plan.name}</p><span className="text-[11px] font-bold text-premium">{plan.slug === "mensal" ? "Entrada" : "Economize"}</span></div>
                        <div className="mt-3">
                          {saving > 0 && <p className="text-xs text-muted-foreground line-through decoration-destructive decoration-2">{formatPrice(reference)}</p>}
                          <p className="text-xl font-extrabold text-premium">{plan.price > 0 ? formatPrice(plan.price) : "Em breve"}</p>
                          {saving > 0 && <p className="mt-1 text-xs font-bold text-success">Você economiza {formatPrice(saving)}</p>}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{plan.duration_days === 30 ? "por mês" : plan.duration_days === 90 ? "a cada 3 meses" : "por ano"}</p>
                      </div>
                    );
                  })}
                </div>
                <Button asChild className="mt-6 w-full bg-premium text-premium-foreground hover:bg-premium/90"><Link to="/planos">Escolher Premium <Crown className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="bizi-reveal-delay">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Por que a Bizi?</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Pequeno negócio não precisa de ferramenta complicada.</h2>
            <p className="mt-4 text-muted-foreground">Quem toca um pequeno negócio já precisa cuidar de cliente, venda, divulgação, pagamento e rotina. A Bizi existe para tirar pequenas tarefas do caminho sem exigir conhecimento técnico ou horas de configuração.</p>
            <p className="mt-4 text-muted-foreground">Um link melhor para o WhatsApp, um QR Code pronto, um orçamento organizado ou uma presença digital mais profissional parecem detalhes. Na prática, são pontos de contato que ajudam o cliente a encontrar, entender e comprar do seu negócio com menos atrito.</p>
            <p className="mt-4 font-medium text-foreground">Você cuida do negócio. A Bizi cuida da parte operacional que pode ser simplificada.</p>
          </div>
          <div className="grid gap-4">
            {BENEFITS.map((benefit) => <div key={benefit.title} className="surface-card glow-hover flex gap-4 p-5"><benefit.icon className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-semibold">{benefit.title}</h3><p className="mt-1 text-sm text-muted-foreground">{benefit.text}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="container-page pb-12 md:pb-16">
        <div className="surface-card flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div><p className="text-sm font-semibold text-primary">Bizi</p><h2 className="mt-1 text-2xl font-semibold">Menos complicação. Mais tempo para o seu negócio.</h2><p className="mt-2 text-sm text-muted-foreground">Comece com as ferramentas grátis e avance quando fizer sentido.</p></div>
          <Button asChild size="lg"><Link to="/ferramentas">Começar agora <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
      </section>
    </PageShell>
  );
}
