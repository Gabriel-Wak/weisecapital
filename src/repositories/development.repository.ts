import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { PaginatedResult } from "@/types";
import type { DevelopmentWithRelations } from "@/types";

export class DevelopmentRepository {
  async findMany(
    tenantId: string,
    params: { page?: number; pageSize?: number; status?: string }
  ): Promise<PaginatedResult<DevelopmentWithRelations>> {
    const { page = 1, pageSize = 12, status } = params;

    const where: Prisma.DevelopmentWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status: status as Prisma.EnumDevelopmentStatusFilter }),
    };

    const [data, total] = await Promise.all([
      prisma.development.findMany({
        where,
        include: {
          media: { orderBy: { order: "asc" }, take: 3 },
          features: true,
          _count: { select: { properties: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.development.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findBySlug(tenantId: string, slug: string) {
    return prisma.development.findFirst({
      where: { tenantId, slug, deletedAt: null },
      include: {
        media: { orderBy: { order: "asc" } },
        features: true,
        properties: {
          where: { deletedAt: null },
          include: { media: { take: 1 } },
        },
      },
    });
  }

  async create(data: Prisma.DevelopmentCreateInput) {
    return prisma.development.create({ data });
  }

  async update(id: string, data: Prisma.DevelopmentUpdateInput) {
    return prisma.development.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.development.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getFeatured(tenantId: string, limit = 4) {
    return prisma.development.findMany({
      where: { tenantId, isFeatured: true, deletedAt: null },
      include: { media: { orderBy: { order: "asc" }, take: 1 } },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}

export const developmentRepository = new DevelopmentRepository();
