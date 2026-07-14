export const APP_NAME = "Weise Capital Imóveis";
export const DEFAULT_TENANT_SLUG = "weise-capital";
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;
export const MAX_UPLOAD_FILES = 20;
export const MAX_FILE_SIZE_MB = 10;

export const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartamento" },
  { value: "HOUSE", label: "Casa" },
  { value: "PENTHOUSE", label: "Cobertura" },
  { value: "STUDIO", label: "Studio" },
  { value: "LOFT", label: "Loft" },
  { value: "COMMERCIAL", label: "Comercial" },
  { value: "LAND", label: "Terreno" },
  { value: "FARM", label: "Fazenda" },
  { value: "WAREHOUSE", label: "Galpão" },
] as const;

export const PROPERTY_PURPOSES = [
  { value: "SALE", label: "Venda" },
  { value: "RENT", label: "Locação" },
  { value: "BOTH", label: "Venda e Locação" },
] as const;

export const PROPERTY_STATUSES = [
  { value: "AVAILABLE", label: "Disponível" },
  { value: "RESERVED", label: "Reservado" },
  { value: "SOLD", label: "Vendido" },
  { value: "RENTED", label: "Alugado" },
  { value: "UNAVAILABLE", label: "Indisponível" },
] as const;

export const USER_ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
  { value: "BROKER", label: "Corretor" },
  { value: "EDITOR", label: "Editor" },
] as const;

export const LEAD_SOURCES = [
  { value: "WEBSITE", label: "Website" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Telefone" },
  { value: "REFERRAL", label: "Indicação" },
  { value: "SOCIAL_MEDIA", label: "Redes Sociais" },
  { value: "PORTAL", label: "Portal" },
  { value: "OTHER", label: "Outro" },
] as const;
