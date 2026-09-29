import { Link } from "@tanstack/react-router";
import { ArrowLeft, Construction, Crown } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export type ToolWorkspaceData = {
  name: string;
  description: string;
  premium: boolean;
};

export const TOOL_WORKSPACES: Record<string, ToolWorkspaceData> = {
  "link-bio": { name: "Link na Bio Inteligente", description: "Crie uma página única para reunir seus links, contatos e canais digitais.", premium: true },
  "link-temporario": { name: "Link Temporário", description: "Crie links com validade definida para compartilhar arquivos, ofertas ou informações.", premium: true },
  encurtador: { name: "Encurtador de Links", description: "Transforme links longos em endereços curtos e fáceis de compartilhar.", premium: true },
  "botoes-site": { name: "Botões WhatsApp / Redes Sociais", description: "Crie botões prontos para conectar seu site aos seus canais de atendimento.", premium: true },
  "qr-personalizado": { name: "QR Code Personalizado", description: "Personalize aparência e identidade visual do seu QR Code.", premium: true },
  "qr-dinamico": { name: "QR Code Dinâmico", description: "Crie QR Codes que podem manter o mesmo código enquanto o destino é atualizado.", premium: true },
  "qr-pix": { name: "QR Code Pix", description: "Crie QR Codes para facilitar pagamentos via Pix.", premium: true },
  "placa-pix": { name: "Placa Pix", description: "Monte uma placa Pix pronta para impressão e atendimento no seu negócio.", premium: true },
  orcamento: { name: "Orçamento", description: "Crie orçamentos profissionais e prontos para enviar ao cliente.", premium: true },
  recibo: { name: "Recibo", description: "Gere recibos organizados para registrar seus recebimentos.", premium: true },
  "cartao-digital": { name: "Cartão Digital", description: "Crie um cartão digital profissional para compartilhar seus contatos.", premium: true },
};

export function ToolWorkspace({ slug }: { slug: string }) {
  const tool = TOOL_WORKSPACES[slug];

  if (!tool) {
    return (
      <PageShell>
        <section className="container-page py-12 md:py-16">
          <div className="surface-card mx-auto max-w-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold">Ferramenta não encontrada</h1>
            <p className="mt-2 text-muted-foreground">O endereço informado não corresponde a uma ferramenta da Bizi.</p>
            <Button asChild className="mt-6"><Link to="/ferramentas">Voltar para ferramentas</Link></Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="container-page py-8 md:py-12">
        <Link to="/ferramentas" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para ferramentas
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Construction className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Ambiente da ferramenta</p>
                <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{tool.name}</h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">{tool.description}</p>
              </div>
            </div>

            <div className="surface-card mt-8 min-h-[360px] p-6 md:p-8">
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <Construction className="h-10 w-10 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Área de desenvolvimento</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Esta é a página própria desta ferramenta. A aplicação será construída aqui, com seus campos, regras, resultado, downloads e demais funcionalidades.
                </p>
              </div>
            </div>
          </div>

          <aside className="surface-card p-5">
            {tool.premium ? (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-premium"><Crown className="h-4 w-4" /> Recurso Premium</div>
                <p className="mt-3 text-sm text-muted-foreground">A estrutura da página já está separada para receber a aplicação e a validação de acesso Premium.</p>
              </>
            ) : null}
            <Button asChild variant="outline" className="mt-5 w-full"><Link to="/ferramentas">Ver outras ferramentas</Link></Button>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
