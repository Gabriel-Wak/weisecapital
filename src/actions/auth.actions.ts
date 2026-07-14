"use server";

import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { translateAuthError } from "@/lib/auth/sync-user";
import { siteConfig } from "@/config/site";
import type { ActionResult } from "@/types";

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url;
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      {
        redirectTo: `${appUrl}/auth/callback?next=/admin`,
      }
    );

    if (error) {
      return { success: false, error: translateAuthError(error.message) };
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
