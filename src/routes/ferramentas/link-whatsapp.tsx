import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, MessageCircle, RotateCcw, Share2, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { useAccount } from "@/lib/session";
import { PageShell } from "@/components/page-shell";
import { ToolHeader } from "@/components/tool-header";
import { PremiumBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/ferramentas/link-whatsapp")({
  component: WhatsAppLinkPage,
});

const DEFAULT_MESSAGE = "Olá, gostaria de saber mais.";

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function validatePhone(value: string) {
  const digits = normalizePhone(value);

  if (!digits) {
    return "Informe o número do WhatsApp.";
  }

  if (digits.length < 8 || digits.length > 15) {
    return "Informe um número válido com DDI e DDD.";
  }

  if (digits.startsWith("55") && !/^55\d{10,11}$/.test(digits)) {
    return "Para números do Brasil, use DDI 55 + DDD + número.";
  }

  return "";
}

function WhatsAppLinkPage() {
  const { user, account } = useAccount();
  const isPremium = Boolean(user && account?.isPremium);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [copied, setCopied] = useState(false);

  const phoneError = useMemo(() => validatePhone(phone), [phone]);
  const hasPhone = normalizePhone(phone).length > 0;
  const link = useMemo(() => {
    const digits = normalizePhone(phone);

    if (!digits || phoneError) return "";

    const params = new URLSearchParams();
    const finalMessage = isPremium ? message.trim() : DEFAULT_MESSAGE;

    if (finalMessage) {
      params.set("text", finalMessage);
    }

    const query = params.toString();
    return `https://wa.me/${digits}${query ? `?${query}` : ""}`;
  }, [phone, phoneError, message, isPremium]);

  async function copyLink() {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copiado com sucesso.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não conseguimos copiar o link. Tente novamente.");
    }
  }

  async function shareLink() {
    if (!link) return;

    if (!navigator.share) {
      await copyLink();
      toast.info("Seu navegador não oferece compartilhamento direto. O link foi copiado.");
      return;
    }

    try {
      await navigator.share({
        title: "Meu WhatsApp",
        text: "Fale comigo pelo WhatsApp.",
        url: link,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Não conseguimos compartilhar o link. Tente novamente.");
    }
  }

  function openWhatsApp() {
    if (!link) return;
    window.open(link, "_blank", "noopener,noreferrer");
  }

  function clear() {
    setPhone("");
    setMessage(DEFAULT_MESSAGE);
    setCopied(false);
  }

  const messageLocked = !isPremium;

  return (
    <PageShell>
      <section className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <ToolHeader
            eyebrow="Ferramenta grátis"
            title="Gerador de Link WhatsApp"
            description="Crie um link real para seus clientes iniciarem uma conversa com você no WhatsApp. O link funciona sem precisar de site ou aplicativo extra."
            icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface-card space-y-6 p-6 md:p-7">
              <div className="space-y-2">
                <Label htmlFor="phone">Número do WhatsApp</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+55 11 99999-9999"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(phoneError && hasPhone)}
                />
                <p className="text-xs text-muted-foreground">
                  Use DDI + DDD + número. Ex.: +55 11 99999-9999.
                </p>
                {phoneError && hasPhone ? (
                  <p className="text-sm text-destructive" role="alert">{phoneError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="message">Mensagem automática</Label>
                  {messageLocked ? <PremiumBadge /> : null}
                </div>
                <Textarea
                  id="message"
                  value={isPremium ? message : DEFAULT_MESSAGE}
                  onChange={(event) => setMessage(event.target.value)}
                  readOnly={messageLocked}
                  rows={4}
                  className={messageLocked ? "cursor-not-allowed opacity-80" : undefined}
                  aria-describedby="message-help"
                />
                <p id="message-help" className="text-xs text-muted-foreground">
                  {messageLocked
                    ? "No plano grátis, usamos: “Olá, gostaria de saber mais.” Assine o Premium para criar mensagens personalizadas."
                    : "Sua mensagem será codificada corretamente no link do WhatsApp."}
                </p>
                {messageLocked ? (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/planos">Desbloquear mensagem personalizada</Link>
                  </Button>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={clear}>
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Limpar
                </Button>
              </div>
            </div>

            <div className="surface-card flex flex-col p-6 md:p-7">
              <div>
                <p className="text-sm font-semibold">Seu link</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Este é o endereço real que será aberto pelo WhatsApp.
                </p>
              </div>

              <div
                className="mt-5 min-h-28 rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed break-all"
                aria-live="polite"
              >
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {link}
                  </a>
                ) : (
                  <span className="text-muted-foreground">
                    Informe um número válido para gerar seu link.
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-2">
                <Button type="button" disabled={!link} onClick={copyLink}>
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  {copied ? "Copiado" : "Copiar link"}
                </Button>

                <Button type="button" variant="outline" disabled={!link} onClick={openWhatsApp}>
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  Abrir WhatsApp
                </Button>

                <Button type="button" variant="outline" disabled={!link} onClick={shareLink}>
                  <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Compartilhar
                </Button>
              </div>

              <div className="mt-6 rounded-xl border border-border/70 bg-background/40 p-4">
                <p className="text-sm font-semibold">Como funciona</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• O número é normalizado antes da geração.</li>
                  <li>• A mensagem é codificada na URL.</li>
                  <li>• O endereço usa o formato oficial wa.me.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
