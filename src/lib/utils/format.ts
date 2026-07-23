import slugify from "slugify";
import { nanoid } from "nanoid";

export function createSlug(text: string): string {
  const base = slugify(text, { lower: true, strict: true, locale: "pt" });
  return `${base}-${nanoid(6)}`;
}

export function formatCurrency(
  value: number | string | { toString(): string }
): string {
  const num = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatArea(
  value: number | string | { toString(): string } | null | undefined
): string {
  if (!value) return "—";
  const num = typeof value === "number" ? value : Number(value);
  return `${num.toLocaleString("pt-BR")} m²`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  // Aceita URL completa (wa.me/...) ou só o número
  const digits = cleaned.length >= 10 ? cleaned : phone.replace(/\D/g, "");
  const fullNumber = digits.startsWith("55") ? digits : `55${digits}`;
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${fullNumber}${encodedMessage}`;
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

export function propertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: "Apartamento",
    HOUSE: "Casa",
    PENTHOUSE: "Cobertura",
    STUDIO: "Studio",
    LOFT: "Loft",
    COMMERCIAL: "Comercial",
    LAND: "Terreno",
    FARM: "Fazenda",
    WAREHOUSE: "Galpão",
  };
  return labels[type] ?? type;
}

export function propertyPurposeLabel(purpose: string): string {
  const labels: Record<string, string> = {
    SALE: "Venda",
    RENT: "Locação",
    BOTH: "Venda e Locação",
  };
  return labels[purpose] ?? purpose;
}

export function propertyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: "Disponível",
    RESERVED: "Reservado",
    SOLD: "Vendido",
    RENTED: "Alugado",
    UNAVAILABLE: "Indisponível",
  };
  return labels[status] ?? status;
}
