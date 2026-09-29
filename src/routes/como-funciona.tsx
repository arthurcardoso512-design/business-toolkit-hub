import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/como-funciona")({ component: HowItWorksPage });

const STEPS = [
  { title: "Escolha uma ferramenta", text: "Encontre o recurso que resolve o que você precisa agora." },
  { title: "Preencha as informações", text: "Informe somente os dados necessários para gerar o resultado." },
  { title: "Use e compartilhe", text: "Copie, baixe ou compartilhe o material criado." },
];

function HowItWorksPage() {
  return (
    <PageShell>
      <section className="container-page py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Como funciona</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Tudo feito para ser simples</h1>
          <p className="mt-3 text-muted-foreground">
            O Hub reúne ferramentas práticas em um único lugar, sem exigir conhecimento técnico.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <article key={step.title} className="surface-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground md:block" aria-hidden="true" />
              </div>
              <CheckCircle2 className="mt-7 h-5 w-5 text-success" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
