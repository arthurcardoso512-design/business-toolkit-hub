import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ToolCard } from "@/components/tool-card";
import { ErrorState, LoadingState } from "@/components/states";
import { useTools } from "@/lib/queries";

export const Route = createFileRoute("/ferramentas")({ component: ToolsPage });

function ToolsPage() {
  const { data: tools, isLoading, error, refetch } = useTools();

  return (
    <PageShell>
      <section className="container-page py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Hub de ferramentas</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Ferramentas para o seu negócio</h1>
          <p className="mt-3 text-muted-foreground">
            Crie, divulgue e organize recursos úteis para atender seus clientes de forma mais profissional.
          </p>
        </div>

        {isLoading ? (
          <LoadingState label="Carregando ferramentas..." />
        ) : error ? (
          <div className="mt-8"><ErrorState onRetry={() => refetch()} /></div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(tools ?? []).map((tool) => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        )}
      </section>
    </PageShell>
  );
}
