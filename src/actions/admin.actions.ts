"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { developmentRepository } from "@/repositories/development.repository";
import prisma from "@/lib/prisma";
import type { ActionResult } from "@/types";

async function auditDelete(
  session: { id: string; tenantId: string },
  entity: string,
  entityId: string
) {
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity,
      entityId,
      tenantId: session.tenantId,
      userId: session.id,
    },
  });
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "leads:delete");

    await prisma.lead.update({
      where: { id, tenantId: session.tenantId },
      data: { deletedAt: new Date() },
    });

    await auditDelete(session, "Lead", id);
    revalidatePath("/admin/leads");
    revalidatePath("/admin/crm");
    revalidatePath("/admin");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir lead",
    };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "banners:write");

    await prisma.banner.update({
      where: { id, tenantId: session.tenantId },
      data: { deletedAt: new Date() },
    });

    await auditDelete(session, "Banner", id);
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir banner",
    };
  }
}

export async function deleteVideo(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "banners:write");

    await prisma.video.update({
      where: { id, tenantId: session.tenantId },
      data: { deletedAt: new Date() },
    });

    await auditDelete(session, "Video", id);
    revalidatePath("/admin/videos");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir vídeo",
    };
  }
}

export async function deleteDevelopment(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "developments:delete");

    await developmentRepository.softDelete(id);
    await auditDelete(session, "Development", id);
    revalidatePath("/admin/empreendimentos");
    revalidatePath("/empreendimentos");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir",
    };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "users:delete");

    if (session.id === id) {
      return { success: false, error: "Você não pode excluir sua própria conta" };
    }

    await prisma.user.update({
      where: { id, tenantId: session.tenantId },
      data: { deletedAt: new Date(), isActive: false },
    });

    await auditDelete(session, "User", id);
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/corretores");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir usuário",
    };
  }
}

export async function deleteAppointment(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "crm:write");

    await prisma.appointment.delete({
      where: { id },
    });

    await auditDelete(session, "Appointment", id);
    revalidatePath("/admin/agenda");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir",
    };
  }
}
