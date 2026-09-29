/**
 * Metadados de apresentação das ferramentas (ícone e destino).
 * A disponibilidade real (ativa / gratuita) vem sempre do banco.
 */
export const TOOL_ROUTES: Record<string, string | null> = {
  "link-whatsapp": "/ferramentas/link-whatsapp",
  "qr-code": "/ferramentas/qr-code",
  "qr-wifi": "/ferramentas/qr-code",
  "link-bio": null,
  "link-temporario": null,
  encurtador: null,
  "botoes-site": null,
  "qr-personalizado": null,
  "qr-dinamico": null,
  "qr-pix": null,
  "placa-pix": null,
  orcamento: null,
  recibo: null,
  "cartao-digital": null,
};

export const TOOL_ICONS: Record<string, string> = {
  "link-whatsapp": "MessageCircle",
  "link-bio": "Link2",
  "link-temporario": "Timer",
  encurtador: "Scissors",
  "botoes-site": "MousePointerClick",
  "qr-code": "QrCode",
  "qr-personalizado": "Palette",
  "qr-dinamico": "RefreshCw",
  "qr-wifi": "Wifi",
  "qr-pix": "Banknote",
  "placa-pix": "Frame",
  orcamento: "FileText",
  recibo: "ReceiptText",
  "cartao-digital": "IdCard",
};

export const CATEGORY_ORDER = ["Links", "QR Codes", "Pix", "Documentos", "Presença digital"];
