import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowRight, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/states";
import { useAccount, daysUntil, formatDate } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading, account, error, refetch } = useAccount();

  if (loading) {
    return <PageShell><LoadingState label="Carregando seu painel..." /></PageShell>;
  }

  if (!user) return <Navigate to="/auth" />;

  async function logout() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      toast.error("Não foi possível sair agora.");
      return;
    }
    toast.success("Até logo!");
  }

  const profile = account?.profile;
  const isPremium = account?.isPremium ?? false;

  return (
    <PageShell>
      <section className="container-page py-10 md:py-14">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Painel</p>
            <h1 className="mt-2 text-3xl font-semibold">Olá, {profile?.name || user.email}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Aqui você acompanha seu plano e acessa suas ferramentas.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Sair
          </Button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p>Não conseguimos carregar todos os dados da sua conta.</p>
            <button className="mt-2 font-medium underline" onClick={() => refetch()}>Tentar novamente</button>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="surface-card p-5 md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Meu plano</p>
                <p className="mt-2 text-2xl font-semibold">{isPremium ? "Premium" : "Grátis"}</p>
              </div>
              {isPremium && <ShieldCheck className="h-6 w-6 text-success" aria-hidden="true" />}
            </div>
            {isPremium && account?.premiumExpiresAt ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Válido até <strong className="text-foreground">{formatDate(account.premiumExpiresAt)}</strong> · faltam {daysUntil(account.premiumExpiresAt)} dias.
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Use as ferramentas gratuitas ou conheça os recursos Premium.</p>
            )}
            <div className="mt-5">
              <Button asChild variant={isPremium ? "outline" : "default"}>
                <Link to="/planos">
                  {isPremium ? "Gerenciar plano" : "Conhecer Premium"}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-sm text-muted-foreground">Sua empresa</p>
            <p className="mt-2 text-lg font-semibold">{profile?.company_name || "Não informado"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Ferramentas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Comece pelas ferramentas gratuitas.</p>
          <div className="mt-5">
            <Button asChild>
              <Link to="/ferramentas">Explorar ferramentas</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
