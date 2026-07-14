import { z } from "zod";

export const propertySearchSchema = z.object({
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  condominium: z.string().optional(),
  type: z
    .enum([
      "APARTMENT",
      "HOUSE",
      "PENTHOUSE",
      "STUDIO",
      "LOFT",
      "COMMERCIAL",
      "LAND",
      "FARM",
      "WAREHOUSE",
    ])
    .optional(),
  purpose: z.enum(["SALE", "RENT", "BOTH"]).optional(),
  status: z
    .enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "UNAVAILABLE"])
    .optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  suites: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  parkingSpaces: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  hasPool: z.coerce.boolean().optional(),
  code: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isLaunch: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(12),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const propertyFormSchema = z.object({
  code: z.string().min(1, "Código obrigatório"),
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  type: z.enum([
    "APARTMENT",
    "HOUSE",
    "PENTHOUSE",
    "STUDIO",
    "LOFT",
    "COMMERCIAL",
    "LAND",
    "FARM",
    "WAREHOUSE",
  ]),
  purpose: z.enum(["SALE", "RENT", "BOTH"]),
  status: z
    .enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "UNAVAILABLE"])
    .default("AVAILABLE"),
  price: z.coerce.number().min(0),
  rentPrice: z.coerce.number().optional(),
  condoFee: z.coerce.number().optional(),
  iptu: z.coerce.number().optional(),
  bedrooms: z.coerce.number().min(0).default(0),
  suites: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  parkingSpaces: z.coerce.number().min(0).default(0),
  area: z.coerce.number().optional(),
  builtArea: z.coerce.number().optional(),
  hasPool: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isLaunch: z.boolean().default(false),
  city: z.string().min(1, "Cidade obrigatória"),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  condominium: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  brokerId: z.string().optional(),
  developmentId: z.string().optional(),
  categoryId: z.string().optional(),
  virtualTourUrl: z.string().url().optional().or(z.literal("")),
});

export const leadFormSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(10, "Telefone obrigatório"),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  source: z
    .enum([
      "WEBSITE",
      "WHATSAPP",
      "PHONE",
      "REFERRAL",
      "SOCIAL_MEDIA",
      "PORTAL",
      "OTHER",
    ])
    .default("WEBSITE"),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone obrigatório"),
  subject: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
export type PropertyFormInput = z.infer<typeof propertyFormSchema>;
export type LeadFormInput = z.infer<typeof leadFormSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
