"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { createSlug } from "@/lib/utils/format";
import { developmentRepository } from "@/repositories/development.repository";
import type { ActionResult } from "@/types";

const developmentSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z
    .enum(["PLANNING", "CONSTRUCTION", "READY", "DELIVERED"])
    .default("PLANNING"),
  builder: z.string().optional(),
  city: z.string().min(1),
  neighborhood: z.string().min(1),
  address: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  totalUnits: z.coerce.number().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
});

const videoSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  url: z.string().url(),
  provider: z.enum(["youtube", "vimeo", "upload"]).default("youtube"),
  order: z.coerce.number().default(0),
});

export async function createDevelopment(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "properties:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = developmentSchema.safeParse({
      ...raw,
      isFeatured: raw.isFeatured === "true",
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    const slug = createSlug(parsed.data.name);
    const dev = await developmentRepository.create({
      ...parsed.data,
      slug,
      tenant: { connect: { id: session.tenantId } },
    });

    revalidatePath("/admin/empreendimentos");
    revalidatePath("/empreendimentos");
    return { success: true, data: { id: dev.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar",
    };
  }
}

export async function createVideo(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "banners:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = videoSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    const video = await prisma.video.create({
      data: { ...parsed.data, tenantId: session.tenantId },
    });

    revalidatePath("/admin/videos");
    return { success: true, data: { id: video.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar vídeo",
    };
  }
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();

    await prisma.notification.update({
      where: { id, userId: session.id },
      data: { isRead: true },
    });

    revalidatePath("/admin/notificacoes");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro",
    };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  try {
    const session = await requireSession();

    await prisma.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/admin/notificacoes");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro",
    };
  }
}
