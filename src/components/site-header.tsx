import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/session";
import { TOOL_ROUTES } from "@/lib/tools-catalog";


const TOOL_MENU = [
  { slug: "link-whatsapp", label: "Link WhatsApp" },
  { slug: "qr-code", label: "QR Code Universal" },
  { slug: "link-bio", label: "Link na Bio Inteligente" },
  { slug: "link-temporario", label: "Link Temporário" },
  { slug: "encurtador", label: "Encurtador de Links" },
  { slug: "botoes-site", label: "Botões WhatsApp / Redes Sociais" },
  { slug: "qr-personalizado", label: "QR Code Personalizado" },
  { slug: "qr-dinamico", label: "QR Code Dinâmico" },
  { slug: "qr-pix", label: "QR Code Pix" },
  { slug: "placa-pix", label: "Placa Pix" },
  { slug: "orcamento", label: "Orçamento" },
  { slug: "recibo", label: "Recibo" },
  { slug: "cartao-digital", label: "Cartão Digital" },
];

const NAV = [
  { to: "/ferramentas", label: "Ferramentas" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/planos", label: "Planos" },
];

function BiziLogo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="bizi-mark" aria-hidden="true"><span /></span>
      <span className="font-display text-lg font-bold tracking-tight">Bizi</span>
    </span>
  );
}

export function SiteHeader() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Bizi — início"><BiziLogo /></Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu de ferramentas" className="h-9 w-9">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetTitle className="px-4 pt-4 text-left"><BiziLogo /></SheetTitle>
              <div className="px-4 pt-5">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ferramentas</p>
                <nav aria-label="Ferramentas Bizi" className="mt-2 flex flex-col gap-1">
                  <Link to="/ferramentas" onClick={() => setOpen(false)} className="rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15">
                    Todas as ferramentas
                  </Link>
                  {TOOL_MENU.map((item) => {
                    const href = TOOL_ROUTES[item.slug];
                    return href ? (
                      <Link key={item.slug} to={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground">
                        {item.label}
                      </Link>
                    ) : null;
                  })}
                </nav>

                <p className="mt-7 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Navegação</p>
                <nav aria-label="Navegação Bizi" className="mt-2 flex flex-col gap-1">
                  {NAV.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground">
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-7 flex flex-col gap-2">
                  {user ? (
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link to="/dashboard">Meu painel</Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" onClick={() => setOpen(false)}>
                        <Link to="/auth">Entrar</Link>
                      </Button>
                      <Button asChild onClick={() => setOpen(false)}>
                        <Link to="/auth" search={{ modo: "cadastro" }}>Começar grátis</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild size="sm"><Link to="/dashboard">Meu painel</Link></Button>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost"><Link to="/auth">Entrar</Link></Button>
              <Button asChild size="sm"><Link to="/auth" search={{ modo: "cadastro" }}>Começar grátis</Link></Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-2 py-10 text-sm text-muted-foreground">
        <BiziLogo />
        <p>Ferramentas simples para negócios reais.</p>
      </div>
    </footer>
  );
}
