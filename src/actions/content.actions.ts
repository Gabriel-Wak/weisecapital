"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { createSlug } from "@/lib/utils/format";
import prisma from "@/lib/prisma";
import type { ActionResult } from "@/types";

const blogSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  isPublished: z.coerce.boolean().default(false),
});

const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  imageDesktop: z.string().url(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  position: z.enum(["HOME_HERO", "HOME_MIDDLE", "LISTING", "SIDEBAR"]).default("HOME_HERO"),
  order: z.coerce.number().default(0),
});

export async function createBlogPost(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "blog:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = blogSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    const slug = createSlug(parsed.data.title);
    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        slug,
        publishedAt: parsed.data.isPublished ? new Date() : null,
        tenantId: session.tenantId,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, data: { id: post.id } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro" };
  }
}

export async function createBanner(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "banners:write");

    const raw = Object.fromEntries(formData.entries());
    const parsed = bannerSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    const banner = await prisma.banner.create({
      data: { ...parsed.data, tenantId: session.tenantId },
    });

    revalidatePath("/admin/banners");
    return { success: true, data: { id: banner.id } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro" };
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    const session = await requireSession();
    requirePermission(session.role, "blog:delete");

    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/blog");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro" };
  }
}
