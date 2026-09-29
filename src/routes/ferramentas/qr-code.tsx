import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Download, QrCode, RefreshCw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { ToolHeader } from "@/components/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { buildQrPayload, qrDataUrl, qrSvg, validateQrFields, type QrContentType } from "@/lib/qr";

export const Route = createFileRoute("/ferramentas/qr-code")({ component: QrCodePage });

const types: Array<{ value: QrContentType; label: string }> = [
  { value: "url", label: "URL" },
  { value: "text", label: "Texto" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Telefone" },
  { value: "email", label: "E-mail" },
  { value: "contact", label: "Contato" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "pix", label: "Pix Copia e Cola" },
];

function QrCodePage() {
  const [type, setType] = useState<QrContentType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ security: "WPA" });
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const error = useMemo(() => validateQrFields(type, fields), [type, fields]);
  const payload = useMemo(() => error ? "" : buildQrPayload(type, fields), [type, fields, error]);

  useEffect(() => {
    let cancelled = false;
    if (!payload) {
      setDataUrl("");
      setSvg("");
      return;
    }

    setLoading(true);
    Promise.all([qrDataUrl(payload), qrSvg(payload)])
      .then(([nextDataUrl, nextSvg]) => {
        if (cancelled) return;
        setDataUrl(nextDataUrl);
        setSvg(nextSvg);
      })
      .catch(() => {
        if (!cancelled) toast.error("Não conseguimos gerar o QR Code. Tente novamente.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [payload]);

  function update(key: string, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  function changeType(next: QrContentType) {
    setType(next);
    setFields({ security: "WPA" });
    setCopied(false);
  }

  function downloadPng() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "bizi-qr-code.png";
    link.click();
  }

  function downloadSvg() {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bizi-qr-code.svg";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function copyPayload() {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success("Conteúdo copiado.");
    } catch {
      toast.error("Não conseguimos copiar o conteúdo. Tente novamente.");
    }
  }

  async function share() {
    if (!dataUrl) return;
    if (!navigator.share) {
      downloadPng();
      toast.info("Seu navegador não oferece compartilhamento direto. O PNG foi preparado para você.");
      return;
    }
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "bizi-qr-code.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "QR Code Bizi", files: [file] });
      } else {
        await navigator.share({ title: "QR Code Bizi", text: payload });
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      toast.error("Não conseguimos compartilhar o QR Code.");
    }
  }

  const input = (key: string, label: string, placeholder = "") => (
    <div className="space-y-2">
      <Label htmlFor={`qr-${key}`}>{label}</Label>
      <Input id={`qr-${key}`} value={fields[key] ?? ""} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} />
    </div>
  );

  function renderFields() {
    switch (type) {
      case "url": return input("url", "URL do site", "https://seunegocio.com.br");
      case "text": return (
        <div className="space-y-2"><Label htmlFor="qr-text">Texto</Label><Textarea id="qr-text" value={fields.text ?? ""} onChange={(e) => update("text", e.target.value)} placeholder="Digite o texto que será armazenado no QR Code." rows={5} /></div>
      );
      case "whatsapp": return <>{input("phone", "Telefone", "+55 11 99999-9999")} {input("message", "Mensagem (opcional)", "Olá, gostaria de saber mais.")}</>;
      case "phone": return input("phone", "Número", "+55 11 99999-9999");
      case "email": return <>{input("email", "E-mail", "contato@empresa.com")} {input("subject", "Assunto", "Olá")} {input("message", "Mensagem", "Gostaria de saber mais.")}</>;
      case "contact": return <>{input("name", "Nome", "João da Silva")} {input("phone", "Telefone", "+55 11 99999-9999")} {input("email", "E-mail", "joao@empresa.com")} {input("company", "Empresa", "Minha empresa")}</>;
      case "wifi": return <>{input("ssid", "Nome da rede", "Minha Wi-Fi")} {input("password", "Senha", "Sua senha")} <div className="space-y-2"><Label htmlFor="qr-security">Segurança</Label><select id="qr-security" value={fields.security ?? "WPA"} onChange={(e) => update("security", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="WPA">WPA/WPA2/WPA3</option><option value="WEP">WEP</option><option value="nopass">Sem senha</option></select></div></>;
      case "pix": return <div className="space-y-2"><Label htmlFor="qr-payload">Pix Copia e Cola</Label><Textarea id="qr-payload" value={fields.payload ?? ""} onChange={(e) => update("payload", e.target.value)} placeholder="Cole aqui o código Pix Copia e Cola." rows={6} /></div>;
    }
  }

  return (
    <PageShell>
      <section className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <ToolHeader eyebrow="Ferramenta grátis" title="Gerador de QR Code" description="Crie QR Codes reais para links, WhatsApp, contatos, Wi-Fi, e-mail e outros conteúdos." icon={<QrCode className="h-5 w-5" aria-hidden="true" />} />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="surface-card space-y-6 p-6 md:p-7">
              <div className="space-y-2"><Label htmlFor="qr-type">Tipo de conteúdo</Label><select id="qr-type" value={type} onChange={(e) => changeType(e.target.value as QrContentType)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <div className="space-y-4">{renderFields()}</div>
              {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
              <Button type="button" variant="outline" onClick={() => { setFields({ security: "WPA" }); setCopied(false); }}>
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />Limpar
              </Button>
            </div>

            <div className="surface-card flex flex-col items-center p-6 md:p-7">
              <div className="flex min-h-80 w-full flex-col items-center justify-center rounded-xl border border-border bg-white p-5">
                {loading ? <p className="text-sm text-muted-foreground">Gerando QR Code...</p> : dataUrl ? <img src={dataUrl} alt="QR Code gerado" className="h-64 w-64 max-w-full" /> : <div className="text-center text-sm text-muted-foreground"><QrCode className="mx-auto h-10 w-10" /><p className="mt-3">Preencha os campos para gerar seu QR Code.</p></div>}
              </div>
              <div className="mt-5 grid w-full gap-2">
                <Button disabled={!dataUrl || loading} onClick={downloadPng}><Download className="mr-2 h-4 w-4" aria-hidden="true" />Baixar PNG</Button>
                <Button variant="outline" disabled={!svg || loading} onClick={downloadSvg}><Download className="mr-2 h-4 w-4" aria-hidden="true" />Baixar SVG</Button>
                <Button variant="outline" disabled={!payload} onClick={copyPayload}>{copied ? <Check className="mr-2 h-4 w-4" aria-hidden="true" /> : <Copy className="mr-2 h-4 w-4" aria-hidden="true" />}{copied ? "Copiado" : "Copiar conteúdo"}</Button>
                <Button variant="outline" disabled={!dataUrl || loading} onClick={share}><Share2 className="mr-2 h-4 w-4" aria-hidden="true" />Compartilhar</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
