import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { PaginatedResult, LeadWithRelations } from "@/types";

export class LeadRepository {
  async findMany(
    tenantId: string,
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      stageId?: string;
      brokerId?: string;
    }
  ): Promise<PaginatedResult<LeadWithRelations>> {
    const { page = 1, pageSize = 20, status, stageId, brokerId } = params;

    const where: Prisma.LeadWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status: status as Prisma.EnumLeadStatusFilter }),
      ...(stageId && { stageId }),
      ...(brokerId && { brokerId }),
    };

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          broker: true,
          property: { include: { media: { take: 1 } } },
          stage: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lead.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findByStage(tenantId: string) {
    const stages = await prisma.pipelineStage.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
      include: {
        leads: {
          where: { deletedAt: null },
          include: {
            broker: true,
            property: { include: { media: { take: 1 } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return stages;
  }

  async create(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({ data });
  }

  async update(id: string, data: Prisma.LeadUpdateInput) {
    return prisma.lead.update({ where: { id }, data });
  }

  async moveToStage(id: string, stageId: string) {
    return prisma.lead.update({
      where: { id },
      data: { stageId },
    });
  }

  async addHistory(leadId: string, action: string, details?: string) {
    return prisma.leadHistory.create({
      data: { leadId, action, details },
    });
  }
}

export const leadRepository = new LeadRepository();
