import type {
  Property,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  Media,
} from "@prisma/client";

/** Plain property shape safe for Client Components and JSON APIs. */
export type PropertyCardData = {
  id: string;
  slug: string;
  code: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number;
  rentPrice: number | null;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number | null;
  city: string;
  neighborhood: string;
  isFeatured: boolean;
  isLaunch: boolean;
  media?: Pick<Media, "url" | "alt">[];
};

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  return Number(value);
}

export function toPropertyCardData(
  property: Property & { media?: Media[] }
): PropertyCardData {
  return {
    id: property.id,
    slug: property.slug,
    code: property.code,
    title: property.title,
    type: property.type,
    purpose: property.purpose,
    status: property.status,
    price: Number(property.price),
    rentPrice: toNumber(property.rentPrice),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    area: toNumber(property.area),
    city: property.city,
    neighborhood: property.neighborhood,
    isFeatured: property.isFeatured,
    isLaunch: property.isLaunch,
    media: property.media?.map((m) => ({ url: m.url, alt: m.alt })),
  };
}

export function toPropertyCardDataList(
  properties: (Property & { media?: Media[] })[]
): PropertyCardData[] {
  return properties.map(toPropertyCardData);
}

/** Full property serialized for REST API (all Decimal/Date → plain values). */
export function serializeProperty(
  property: Property & { media?: Media[] }
): Record<string, unknown> {
  return {
    ...property,
    price: Number(property.price),
    rentPrice: toNumber(property.rentPrice),
    condoFee: toNumber(property.condoFee),
    iptu: toNumber(property.iptu),
    area: toNumber(property.area),
    builtArea: toNumber(property.builtArea),
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
    deletedAt: property.deletedAt?.toISOString() ?? null,
    media: property.media,
  };
}
