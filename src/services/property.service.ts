import { propertyRepository } from "@/repositories/property.repository";
import { tenantRepository } from "@/repositories/tenant.repository";
import { createSlug } from "@/lib/utils/format";
import { toPropertyCardData, toPropertyCardDataList } from "@/lib/utils/serialize";
import type { PropertySearchParams, ActionResult } from "@/types";
import type { PropertyFormInput } from "@/lib/validators";
import prisma from "@/lib/prisma";

export class PropertyService {
  async search(tenantSlug: string, params: PropertySearchParams) {
    const tenant = await tenantRepository.findBySlug(tenantSlug);
    if (!tenant) throw new Error("Tenant não encontrado");
    const result = await propertyRepository.findMany(tenant.id, params);
    return {
      ...result,
      data: toPropertyCardDataList(result.data),
    };
  }

  async getBySlug(tenantSlug: string, slug: string) {
    const tenant = await tenantRepository.findBySlug(tenantSlug);
    if (!tenant) return null;
    const property = await propertyRepository.findBySlug(tenant.id, slug);
    if (property) {
      await propertyRepository.incrementViews(property.id);
    }
    return property;
  }

  async getFeatured(tenantSlug: string) {
    const tenant = await tenantRepository.findBySlug(tenantSlug);
    if (!tenant) return [];
    const properties = await propertyRepository.getFeatured(tenant.id);
    return toPropertyCardDataList(properties);
  }

  async getLaunches(tenantSlug: string) {
    const tenant = await tenantRepository.findBySlug(tenantSlug);
    if (!tenant) return [];
    const properties = await propertyRepository.getLaunches(tenant.id);
    return toPropertyCardDataList(properties);
  }

  async create(
    tenantId: string,
    data: PropertyFormInput
  ): Promise<ActionResult<{ id: string }>> {
    try {
      const slug = createSlug(data.title);
      const property = await propertyRepository.create({
        ...data,
        slug,
        price: data.price,
        tenant: { connect: { id: tenantId } },
        ...(data.brokerId && { broker: { connect: { id: data.brokerId } } }),
        ...(data.developmentId && {
          development: { connect: { id: data.developmentId } },
        }),
        ...(data.categoryId && {
          category: { connect: { id: data.categoryId } },
        }),
      });
      return { success: true, data: { id: property.id } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao criar imóvel",
      };
    }
  }

  async getRelated(propertyId: string, tenantId: string, limit = 4) {
    const property = await propertyRepository.findById(propertyId);
    if (!property) return [];

    const related = await prisma.property.findMany({
      where: {
        tenantId,
        deletedAt: null,
        id: { not: propertyId },
        OR: [
          { neighborhood: property.neighborhood },
          { type: property.type },
          { city: property.city },
        ],
      },
      include: { media: { orderBy: { order: "asc" }, take: 1 } },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return toPropertyCardDataList(related);
  }
}

export const propertyService = new PropertyService();
