"use server";

import { revalidatePath } from "next/cache";
import { leadRepository } from "@/repositories/lead.repository";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import prisma from "@/lib/prisma";
import type { ActionResult } from "@/types";

export async function moveLeadToStage(
  leadId: string,
  stageId: string
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "crm:write");

    await leadRepository.moveToStage(leadId, stageId);
    await leadRepository.addHistory(leadId, "STAGE_CHANGED", `Movido para estágio ${stageId}`);

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Lead",
        entityId: leadId,
        tenantId: session.tenantId,
        userId: session.id,
        details: { stageId },
      },
    });

    revalidatePath("/admin/crm");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao mover lead",
    };
  }
}
