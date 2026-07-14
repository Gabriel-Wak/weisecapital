"use server";

import { revalidatePath } from "next/cache";
import { propertyRepository } from "@/repositories/property.repository";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { propertyFormSchema } from "@/lib/validators";
import prisma from "@/lib/prisma";
import type { ActionResult } from "@/types";

function parsePropertyForm(raw: Record<string, FormDataEntryValue>) {
  return propertyFormSchema.safeParse({
    ...raw,
    price: Number(raw.price),
    rentPrice: raw.rentPrice ? Number(raw.rentPrice) : undefined,
    condoFee: raw.condoFee ? Number(raw.condoFee) : undefined,
    iptu: raw.iptu ? Number(raw.iptu) : undefined,
    area: raw.area ? Number(raw.area) : undefined,
    bedrooms: Number(raw.bedrooms ?? 0),
    suites: Number(raw.suites ?? 0),
    bathrooms: Number(raw.bathrooms ?? 0),
    parkingSpaces: Number(raw.parkingSpaces ?? 0),
    hasPool: raw.hasPool === "true",
    isFeatured: raw.isFeatured === "true",
    isLaunch: raw.isLaunch === "true",
  });
}

export async function createProperty(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "properties:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = parsePropertyForm(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    const { createSlug } = await import("@/lib/utils/format");
    const slug = createSlug(parsed.data.title);
    const property = await propertyRepository.create({
      ...parsed.data,
      virtualTourUrl: parsed.data.virtualTourUrl || null,
      slug,
      tenant: { connect: { id: session.tenantId } },
      ...(parsed.data.brokerId && {
        broker: { connect: { id: parsed.data.brokerId } },
      }),
    });

    const imageUrls = formData.getAll("imageUrls") as string[];
    if (imageUrls.length > 0) {
      await prisma.media.createMany({
        data: imageUrls.map((url, i) => ({
          url,
          type: "IMAGE",
          mimeType: "image/webp",
          order: i,
          propertyId: property.id,
        })),
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Property",
        entityId: property.id,
        tenantId: session.tenantId,
        userId: session.id,
      },
    });

    revalidatePath("/admin/imoveis");
    revalidatePath("/imoveis");
    return { success: true, data: { id: property.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar imóvel",
    };
  }
}

export async function updateProperty(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "properties:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = parsePropertyForm(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    await propertyRepository.update(id, {
      ...parsed.data,
      virtualTourUrl: parsed.data.virtualTourUrl || null,
      ...(parsed.data.brokerId
        ? { broker: { connect: { id: parsed.data.brokerId } } }
        : { broker: { disconnect: true } }),
    });

    const imageUrls = formData.getAll("imageUrls") as string[];
    if (imageUrls.length > 0) {
      await prisma.media.deleteMany({ where: { propertyId: id } });
      await prisma.media.createMany({
        data: imageUrls.map((url, i) => ({
          url,
          type: "IMAGE",
          mimeType: "image/webp",
          order: i,
          propertyId: id,
        })),
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Property",
        entityId: id,
        tenantId: session.tenantId,
        userId: session.id,
      },
    });

    const property = await propertyRepository.findById(id);
    revalidatePath("/admin/imoveis");
    revalidatePath("/imoveis");
    if (property) revalidatePath(`/imoveis/${property.slug}`);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar",
    };
  }
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "properties:delete");

    await propertyRepository.softDelete(id);

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Property",
        entityId: id,
        tenantId: session.tenantId,
        userId: session.id,
      },
    });

    revalidatePath("/admin/imoveis");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir",
    };
  }
}

export async function restoreProperty(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "properties:write");

    await propertyRepository.restore(id);

    await prisma.auditLog.create({
      data: {
        action: "RESTORE",
        entity: "Property",
        entityId: id,
        tenantId: session.tenantId,
        userId: session.id,
      },
    });

    revalidatePath("/admin/imoveis");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao restaurar",
    };
  }
}
