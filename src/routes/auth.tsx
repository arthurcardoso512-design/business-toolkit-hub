import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "cadastro">("cadastro");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "cadastro") {
        if (!name.trim()) throw new Error("Informe seu nome.");
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim(), company_name: companyName.trim() },
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Conta criada com sucesso.");
          await navigate({ to: "/dashboard" });
        } else {
          toast.success("Conta criada. Verifique seu e-mail para continuar.");
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Login realizado.");
        await navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a operação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="container-page flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="surface-card w-full max-w-md p-6 sm:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Link>

          <div className="mt-8">
            <p className="text-sm font-medium text-primary">HUB</p>
            <h1 className="mt-2 text-2xl font-semibold">
              {mode === "cadastro" ? "Crie sua conta" : "Entrar no HUB"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "cadastro"
                ? "Comece grátis e tenha suas ferramentas em um só lugar."
                : "Acesse seu painel e continue de onde parou."}
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "cadastro" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Opcional" />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>

            <Button className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              {mode === "cadastro" ? "Criar conta" : "Entrar"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-5 w-full text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMode(mode === "cadastro" ? "login" : "cadastro")}
          >
            {mode === "cadastro" ? "Já tenho uma conta" : "Ainda não tenho uma conta"}
          </button>
        </div>
      </section>
    </PageShell>
  );
}
