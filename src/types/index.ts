import type {
  Property,
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
  Development,
  DevelopmentStatus,
  Lead,
  LeadStatus,
  LeadSource,
  User,
  UserRole,
  Tenant,
  BlogPost,
  Banner,
  Media,
  Testimonial,
  Partner,
} from "@prisma/client";

export type {
  Property,
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
  Development,
  DevelopmentStatus,
  Lead,
  LeadStatus,
  LeadSource,
  User,
  UserRole,
  Tenant,
  BlogPost,
  Banner,
  Media,
  Testimonial,
  Partner,
};

export type PropertyWithRelations = Property & {
  media: Media[];
  broker: User | null;
  development: Development | null;
  features: { id: string; name: string; value: string | null }[];
};

export type DevelopmentWithRelations = Development & {
  media: Media[];
  features: { id: string; name: string; value: string | null }[];
  _count?: { properties: number };
};

export type LeadWithRelations = Lead & {
  broker: User | null;
  property: Property | null;
  stage: { id: string; name: string; color: string } | null;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PropertySearchParams = {
  city?: string;
  neighborhood?: string;
  condominium?: string;
  type?: PropertyType;
  purpose?: PropertyPurpose;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  minArea?: number;
  maxArea?: number;
  hasPool?: boolean;
  code?: string;
  isFeatured?: boolean;
  isLaunch?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type SessionUser = {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  avatar?: string | null;
};

export type TenantBranding = Pick<
  Tenant,
  | "id"
  | "name"
  | "slug"
  | "logo"
  | "favicon"
  | "primaryColor"
  | "secondaryColor"
  | "accentColor"
  | "phone"
  | "whatsapp"
  | "email"
>;
