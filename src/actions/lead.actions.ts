"use server";

import { leadRepository } from "@/repositories/lead.repository";
import { tenantRepository } from "@/repositories/tenant.repository";
import { leadFormSchema, contactFormSchema } from "@/lib/validators";
import prisma from "@/lib/prisma";
import type { ActionResult } from "@/types";
import { siteConfig } from "@/config/site";

async function notifyAdmins(
  tenantId: string,
  title: string,
  message: string,
  link?: string
) {
  const admins = await prisma.user.findMany({
    where: { tenantId, role: { in: ["ADMIN", "MANAGER"] }, deletedAt: null },
    select: { id: true },
  });

  if (admins.length === 0) return;

  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      tenantId,
      userId: admin.id,
      title,
      message,
      type: "SYSTEM" as const,
      link: link ?? "/admin/leads",
    })),
  });
}

export async function submitLead(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = leadFormSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    const tenant = await tenantRepository.getDefault();
    if (!tenant) return { success: false, error: "Tenant não encontrado" };

    const lead = await leadRepository.create({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
      message: parsed.data.message,
      source: parsed.data.source,
      tenant: { connect: { id: tenant.id } },
      ...(parsed.data.propertyId && {
        property: { connect: { id: parsed.data.propertyId } },
      }),
    });

    await leadRepository.addHistory(
      lead.id,
      "LEAD_CREATED",
      `Lead criado via ${parsed.data.source}`
    );

    await notifyAdmins(
      tenant.id,
      "Novo lead",
      `${parsed.data.name} entrou em contato`,
      "/admin/crm"
    );

    return { success: true, data: { id: lead.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao enviar lead",
    };
  }
}

export async function submitContact(
  formData: FormData
): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = contactFormSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    const tenant = await tenantRepository.getDefault();
    if (!tenant) return { success: false, error: "Tenant não encontrado" };

    await leadRepository.create({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: `[${parsed.data.subject ?? "Contato"}] ${parsed.data.message}`,
      source: "WEBSITE",
      tenant: { connect: { id: tenant.id } },
    });

    await notifyAdmins(
      tenant.id,
      "Nova mensagem de contato",
      `${parsed.data.name} enviou uma mensagem`,
      "/admin/leads"
    );

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao enviar mensagem",
    };
  }
}

export async function searchPropertiesAction(
  searchParams: Record<string, string | undefined>
) {
  const { propertyService } = await import("@/services/property.service");
  const { propertySearchSchema } = await import("@/lib/validators");

  const parsed = propertySearchSchema.safeParse(searchParams);
  if (!parsed.success) return { data: [], total: 0, page: 1, totalPages: 0 };

  return propertyService.search(siteConfig.defaultTenantSlug, parsed.data);
}
