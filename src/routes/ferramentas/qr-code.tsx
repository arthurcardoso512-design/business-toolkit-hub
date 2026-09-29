import { createFileRoute } from "@tanstack/react-router";
import { Download, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/ferramentas/qr-code")({ component: QrCodePage });

function QrCodePage() {
  const [value, setValue] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value.trim()) return;
    QRCode.toCanvas(canvasRef.current, value.trim(), { width: 240, margin: 2, errorCorrectionLevel: "M" });
  }, [value]);

  function download() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <PageShell>
      <section className="container-page py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/12 text-success">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-success">Grátis</p>
              <h1 className="text-2xl font-semibold md:text-3xl">Gerador de QR Code</h1>
            </div>
          </div>

          <p className="mt-3 text-muted-foreground">
            Transforme um link ou texto em um QR Code pronto para compartilhar.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.8fr]">
            <div className="surface-card p-6">
              <Label htmlFor="qr-value">Link ou texto</Label>
              <Input id="qr-value" className="mt-2" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://seunegocio.com.br" />
              <p className="mt-2 text-xs text-muted-foreground">O QR Code é atualizado automaticamente enquanto você digita.</p>
            </div>

            <div className="surface-card flex min-h-72 flex-col items-center justify-center p-6">
              {value.trim() ? (
                <>
                  <canvas ref={canvasRef} className="max-w-full rounded-lg" aria-label="QR Code gerado" />
                  <Button className="mt-5" onClick={download}>
                    <Download className="mr-2 h-4 w-4" />Baixar PNG
                  </Button>
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  <QrCode className="mx-auto h-10 w-10" aria-hidden="true" />
                  <p className="mt-3">Digite um conteúdo para gerar seu QR Code.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
