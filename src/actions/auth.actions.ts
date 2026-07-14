"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import {
  registerSchema,
  forgotPasswordSchema,
} from "@/lib/validators/auth";
import { siteConfig } from "@/config/site";
import type { ActionResult } from "@/types";

export async function registerUser(
  formData: FormData
): Promise<ActionResult<{ email: string }>> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos",
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { name: parsed.data.name },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: siteConfig.defaultTenantSlug },
      });

      if (tenant) {
        await prisma.user.upsert({
          where: { email: parsed.data.email },
          update: {
            name: parsed.data.name,
            supabaseId: data.user.id,
          },
          create: {
            supabaseId: data.user.id,
            email: parsed.data.email,
            name: parsed.data.name,
            role: "BROKER",
            tenantId: tenant.id,
          },
        });
      }
    }

    return { success: true, data: { email: parsed.data.email } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao cadastrar",
    };
  }
}

export async function forgotPassword(
  formData: FormData
): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = forgotPasswordSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "E-mail inválido",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      {
        redirectTo: `${siteConfig.url}/auth/reset-password`,
      }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao enviar e-mail",
    };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
