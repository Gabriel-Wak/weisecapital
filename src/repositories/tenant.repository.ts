import prisma from "@/lib/prisma";
import type { TenantBranding } from "@/types";

export class TenantRepository {
  async findBySlug(slug: string): Promise<TenantBranding | null> {
    return prisma.tenant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        favicon: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        phone: true,
        whatsapp: true,
        email: true,
      },
    });
  }

  async findByDomain(domain: string) {
    return prisma.tenant.findUnique({
      where: { domain, isActive: true },
    });
  }

  async getDefault() {
    return this.findBySlug("weise-capital");
  }
}

export const tenantRepository = new TenantRepository();
