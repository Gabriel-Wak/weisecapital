import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  image,
  url,
  type = "website",
  noIndex = false,
}: SEOProps): Metadata {
  const seoTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  const seoDescription = description ?? siteConfig.description;
  const seoImage = image ?? `${siteConfig.url}/og-image.jpg`;
  const seoUrl = url ?? siteConfig.url;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: seoUrl },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: siteConfig.name,
      images: [{ url: seoImage, width: 1200, height: 630 }],
      locale: "pt_BR",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generatePropertyJsonLd(property: {
  title: string;
  description?: string | null;
  price: number | { toString(): string };
  slug: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area?: number | { toString(): string } | null;
  media?: { url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${siteConfig.url}/imoveis/${property.slug}`,
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: "BRL",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.neighborhood,
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.area
      ? {
          "@type": "QuantitativeValue",
          value: Number(property.area),
          unitCode: "MTK",
        }
      : undefined,
    image: property.media?.[0]?.url,
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [
      siteConfig.links.instagram,
      siteConfig.links.facebook,
      siteConfig.links.linkedin,
    ],
  };
}
