import { createFileRoute } from "@tanstack/react-router";
import { Download, QrCode, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/page-shell";
import { ToolHeader } from "@/components/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { qrDataUrl, qrSvg } from "@/lib/qr";

export const Route = createFileRoute("/ferramentas/qr-wifi")({
  component: QrWifiPage,
});

function QrWifiPage() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(false);

  const payload = useMemo(() => {
    if (!ssid.trim()) return "";
    return `WIFI:T:${security};S:${ssid.trim()};P:${password};H:false;;`;
  }, [ssid, password, security]);

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
        if (!cancelled) {
          setDataUrl("");
          setSvg("");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [payload]);

  function clear() {
    setSsid("");
    setPassword("");
    setSecurity("WPA");
    setDataUrl("");
    setSvg("");
  }

  function downloadPng() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "bizi-qr-wifi.png";
    link.click();
  }

  function downloadSvg() {
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bizi-qr-wifi.svg";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <PageShell>
      <section className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <ToolHeader
            eyebrow="Ferramenta grátis"
            title="QR Code Wi-Fi"
            description="Crie um QR Code para que seus clientes conectem à rede Wi-Fi sem precisar digitar a senha."
            icon={<QrCode className="h-5 w-5" aria-hidden="true" />}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="surface-card space-y-5 p-6 md:p-7">
              <div className="space-y-2">
                <Label htmlFor="wifi-ssid">Nome da rede</Label>
                <Input id="wifi-ssid" value={ssid} onChange={(event) => setSsid(event.target.value)} placeholder="Minha Wi-Fi" autoComplete="off" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi-password">Senha</Label>
                <Input id="wifi-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" type="text" autoComplete="off" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi-security">Segurança</Label>
                <select id="wifi-security" value={security} onChange={(event) => setSecurity(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Sem senha</option>
                </select>
              </div>
              <Button type="button" variant="outline" onClick={clear}>
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                Limpar
              </Button>
            </div>

            <div className="surface-card flex flex-col items-center p-6 md:p-7">
              <div className="flex min-h-72 w-full items-center justify-center rounded-xl border border-border bg-white p-5">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                ) : dataUrl ? (
                  <img src={dataUrl} alt="QR Code para conexão Wi-Fi" className="h-64 w-64 max-w-full" />
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    <QrCode className="mx-auto h-10 w-10" />
                    <p className="mt-3">Informe o nome da rede para gerar.</p>
                  </div>
                )}
              </div>
              <div className="mt-5 grid w-full gap-2">
                <Button disabled={!dataUrl || loading} onClick={downloadPng}>
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Baixar PNG
                </Button>
                <Button variant="outline" disabled={!svg || loading} onClick={downloadSvg}>
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Baixar SVG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
