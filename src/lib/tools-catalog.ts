/**
 * Destinos oficiais das ferramentas.
 * Cada ferramenta possui sua própria rota de trabalho, mesmo quando ainda está em desenvolvimento.
 */
export const TOOL_ROUTES: Record<string, string | null> = {
  "link-whatsapp": "/ferramentas/link-whatsapp",
  "qr-code": "/ferramentas/qr-code",
  "qr-wifi": "/ferramentas/qr-code",
  "link-bio": "/ferramentas/link-bio",
  "link-temporario": "/ferramentas/link-temporario",
  encurtador: "/ferramentas/encurtador",
  "botoes-site": "/ferramentas/botoes-site",
  "qr-personalizado": "/ferramentas/qr-personalizado",
  "qr-dinamico": "/ferramentas/qr-dinamico",
  "qr-pix": "/ferramentas/qr-pix",
  "placa-pix": "/ferramentas/placa-pix",
  orcamento: "/ferramentas/orcamento",
  recibo: "/ferramentas/recibo",
  "cartao-digital": "/ferramentas/cartao-digital",
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
