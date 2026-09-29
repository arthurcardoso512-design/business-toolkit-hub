import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/session";

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
        <Link to="/" aria-label="Bizi — início"><BiziLogo /></Link>

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

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Abrir menu"><Menu className="h-5 w-5" aria-hidden="true" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-xs">
            <SheetTitle className="px-4 pt-4 text-left"><BiziLogo /></SheetTitle>
            <nav aria-label="Menu" className="mt-4 flex flex-col gap-1 px-4">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-2 px-4">
              {user ? (
                <Button asChild onClick={() => setOpen(false)}><Link to="/dashboard">Meu painel</Link></Button>
              ) : (
                <>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}><Link to="/auth">Entrar</Link></Button>
                  <Button asChild onClick={() => setOpen(false)}><Link to="/auth" search={{ modo: "cadastro" }}>Começar grátis</Link></Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
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
