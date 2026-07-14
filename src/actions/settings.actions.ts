"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import type { ActionResult } from "@/types";

const settingsSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  description: z.string().optional(),
  googleAnalytics: z.string().optional(),
  metaPixel: z.string().optional(),
  googleTagManager: z.string().optional(),
  maintenanceMode: z.coerce.boolean().default(false),
});

export async function updateTenantSettings(
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "settings:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = settingsSchema.safeParse({
      ...raw,
      maintenanceMode: raw.maintenanceMode === "true",
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    await prisma.tenant.update({
      where: { id: session.tenantId },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        whatsapp: parsed.data.whatsapp || null,
        email: parsed.data.email || null,
        primaryColor: parsed.data.primaryColor,
        secondaryColor: parsed.data.secondaryColor,
        accentColor: parsed.data.accentColor,
        description: parsed.data.description || null,
        googleAnalytics: parsed.data.googleAnalytics || null,
        metaPixel: parsed.data.metaPixel || null,
        googleTagManager: parsed.data.googleTagManager || null,
        maintenanceMode: parsed.data.maintenanceMode,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Tenant",
        entityId: session.tenantId,
        tenantId: session.tenantId,
        userId: session.id,
        details: { section: "settings" },
      },
    });

    revalidatePath("/admin/configuracoes");
    revalidatePath("/");

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao salvar",
    };
  }
}
