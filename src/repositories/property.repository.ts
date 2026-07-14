import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { PropertySearchParams, PaginatedResult } from "@/types";
import type { PropertyWithRelations } from "@/types";

export class PropertyRepository {
  async findMany(
    tenantId: string,
    params: PropertySearchParams
  ): Promise<PaginatedResult<PropertyWithRelations>> {
    const {
      page = 1,
      pageSize = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
      ...filters
    } = params;

    const where: Prisma.PropertyWhereInput = {
      tenantId,
      deletedAt: null,
      ...(filters.city && { city: { contains: filters.city, mode: "insensitive" } }),
      ...(filters.neighborhood && {
        neighborhood: { contains: filters.neighborhood, mode: "insensitive" },
      }),
      ...(filters.condominium && {
        condominium: { contains: filters.condominium, mode: "insensitive" },
      }),
      ...(filters.type && { type: filters.type }),
      ...(filters.purpose && { purpose: filters.purpose }),
      ...(filters.status && { status: filters.status }),
      ...(filters.code && { code: { contains: filters.code, mode: "insensitive" } }),
      ...(filters.bedrooms && { bedrooms: { gte: filters.bedrooms } }),
      ...(filters.suites && { suites: { gte: filters.suites } }),
      ...(filters.bathrooms && { bathrooms: { gte: filters.bathrooms } }),
      ...(filters.parkingSpaces && {
        parkingSpaces: { gte: filters.parkingSpaces },
      }),
      ...(filters.hasPool !== undefined && { hasPool: filters.hasPool }),
      ...(filters.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
      ...(filters.isLaunch !== undefined && { isLaunch: filters.isLaunch }),
      ...(filters.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
      ...(filters.minArea && { area: { gte: filters.minArea } }),
      ...(filters.maxArea && { area: { lte: filters.maxArea } }),
    };

    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          media: { orderBy: { order: "asc" }, take: 5 },
          broker: true,
          development: true,
          features: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findBySlug(
    tenantId: string,
    slug: string
  ): Promise<PropertyWithRelations | null> {
    return prisma.property.findFirst({
      where: { tenantId, slug, deletedAt: null },
      include: {
        media: { orderBy: { order: "asc" } },
        broker: true,
        development: true,
        features: true,
      },
    });
  }

  async findById(id: string): Promise<PropertyWithRelations | null> {
    return prisma.property.findUnique({
      where: { id },
      include: {
        media: { orderBy: { order: "asc" } },
        broker: true,
        development: true,
        features: true,
      },
    });
  }

  async create(data: Prisma.PropertyCreateInput) {
    return prisma.property.create({ data });
  }

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    return prisma.property.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async incrementViews(id: string) {
    return prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async getFeatured(tenantId: string, limit = 6) {
    return prisma.property.findMany({
      where: { tenantId, isFeatured: true, deletedAt: null, status: "AVAILABLE" },
      include: { media: { orderBy: { order: "asc" }, take: 1 } },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async getLaunches(tenantId: string, limit = 6) {
    return prisma.property.findMany({
      where: { tenantId, isLaunch: true, deletedAt: null },
      include: { media: { orderBy: { order: "asc" }, take: 1 } },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}

export const propertyRepository = new PropertyRepository();
