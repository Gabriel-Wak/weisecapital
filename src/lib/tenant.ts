import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export async function getDefaultTenant() {
  return prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });
}
