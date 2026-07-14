import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/imoveis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/empreendimentos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/politica`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/lgpd`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: siteConfig.defaultTenantSlug },
    });

    if (!tenant) return staticPages;

    const [properties, developments, posts] = await Promise.all([
      prisma.property.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      prisma.development.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { tenantId: tenant.id, isPublished: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const dynamicPages: MetadataRoute.Sitemap = [
      ...properties.map((p) => ({
        url: `${baseUrl}/imoveis/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...developments.map((d) => ({
        url: `${baseUrl}/empreendimentos/${d.slug}`,
        lastModified: d.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...posts.map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}
