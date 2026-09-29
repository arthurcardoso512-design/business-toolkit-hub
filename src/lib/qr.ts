import QRCode from "qrcode";

export type QrContentType = "url" | "text" | "whatsapp" | "phone" | "email" | "contact" | "wifi" | "pix";

export type QrOptions = {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  color?: { dark?: string; light?: string };
};

export async function qrDataUrl(value: string, options: QrOptions = {}) {
  return QRCode.toDataURL(value, {
    width: 320,
    margin: 2,
    errorCorrectionLevel: "M",
    ...options,
  });
}

export async function qrSvg(value: string, options: QrOptions = {}) {
  return QRCode.toString(value, {
    type: "svg",
    margin: 2,
    errorCorrectionLevel: "M",
    ...options,
  });
}

export function buildQrPayload(type: QrContentType, fields: Record<string, string>) {
  switch (type) {
    case "url":
      return fields.url.trim();
    case "text":
      return fields.text;
    case "whatsapp": {
      const phone = fields.phone.replace(/\D/g, "");
      const message = fields.message.trim();
      return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    }
    case "phone":
      return `tel:${fields.phone.replace(/\s+/g, "")}`;
    case "email": {
      const params = new URLSearchParams();
      if (fields.subject) params.set("subject", fields.subject);
      if (fields.message) params.set("body", fields.message);
      const query = params.toString();
      return `mailto:${fields.email.trim()}${query ? `?${query}` : ""}`;
    }
    case "contact":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${fields.name.trim()}`,
        fields.company.trim() ? `ORG:${fields.company.trim()}` : "",
        fields.phone.trim() ? `TEL:${fields.phone.trim()}` : "",
        fields.email.trim() ? `EMAIL:${fields.email.trim()}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    case "wifi":
      return `WIFI:T:${fields.security || "WPA"};S:${fields.ssid};P:${fields.password};H:false;;`;
    case "pix":
      return fields.payload.trim();
    default:
      return "";
  }
}

export function validateQrFields(type: QrContentType, fields: Record<string, string>) {
  const required = (key: string, label: string) => fields[key]?.trim() ? "" : `Informe ${label}.`;

  if (type === "url") {
    const value = fields.url?.trim();
    if (!value) return "Informe a URL.";
    try { new URL(value); } catch { return "Informe uma URL válida, incluindo https://."; }
  }
  if (type === "text") return required("text", "o texto");
  if (type === "whatsapp") {
    const phone = fields.phone.replace(/\D/g, "");
    if (phone.length < 8 || phone.length > 15) return "Informe um telefone válido com DDI.";
  }
  if (type === "phone" && fields.phone.replace(/\D/g, "").length < 8) return "Informe um telefone válido.";
  if (type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) return "Informe um e-mail válido.";
  }
  if (type === "contact") return required("name", "o nome");
  if (type === "wifi") {
    if (!fields.ssid?.trim()) return "Informe o nome da rede.";
    if (fields.security !== "nopass" && !fields.password) return "Informe a senha.";
  }
  if (type === "pix") return required("payload", "o Pix Copia e Cola");
  return "";
}
