import { createFileRoute } from "@tanstack/react-router";
import { Copy, MessageCircle, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/ferramentas/link-whatsapp")({ component: WhatsAppLinkPage });

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function WhatsAppLinkPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const link = useMemo(() => {
    const digits = normalizePhone(phone);
    if (!digits) return "";
    const text = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : "";
    return `https://wa.me/${digits}${text}`;
  }, [phone, message]);

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  }

  function clear() {
    setPhone("");
    setMessage("");
  }

  return (
    <PageShell>
      <section className="container-page py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/12 text-success">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-success">Grátis</p>
              <h1 className="text-2xl font-semibold md:text-3xl">Gerador de Link WhatsApp</h1>
            </div>
          </div>

          <p className="mt-3 text-muted-foreground">
            Crie um link direto para abrir uma conversa no WhatsApp com uma mensagem pronta.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr]">
            <div className="surface-card space-y-5 p-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Número do WhatsApp</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5511999999999" inputMode="tel" />
                <p className="text-xs text-muted-foreground">Inclua o código do país. Ex.: 55 + DDD + número.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem automática (opcional)</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Olá! Gostaria de saber mais sobre..." rows={5} />
              </div>

              <Button type="button" variant="outline" onClick={clear}>
                <RotateCcw className="mr-2 h-4 w-4" />Limpar
              </Button>
            </div>

            <div className="surface-card flex flex-col p-6">
              <p className="text-sm font-semibold">Seu link</p>
              <div className="mt-4 min-h-24 rounded-lg bg-muted p-4 text-sm break-all">
                {link || <span className="text-muted-foreground">Digite o número para gerar o link.</span>}
              </div>
              <Button type="button" className="mt-4 w-full" disabled={!link} onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" />Copiar link
              </Button>
              <Button type="button" variant="outline" className="mt-2 w-full" disabled={!link} asChild>
                <a href={link || "#"} target="_blank" rel="noreferrer">Abrir WhatsApp</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
