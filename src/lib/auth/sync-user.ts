import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncPrismaUser(user: SupabaseUser) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const name =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Usuário";

  return prisma.user.upsert({
    where: { email: user.email! },
    update: {
      supabaseId: user.id,
      name,
    },
    create: {
      supabaseId: user.id,
      email: user.email!,
      name,
      role: "BROKER",
      tenantId: tenant.id,
    },
  });
}

export function translateAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique a caixa de entrada e o spam.";
  }
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid credentials")
  ) {
    return "E-mail ou senha incorretos. Se acabou de se cadastrar, confirme o e-mail primeiro.";
  }
  if (lower.includes("user already registered")) {
    return "Este e-mail já está cadastrado. Tente fazer login.";
  }
  if (lower.includes("password should be at least")) {
    return "A senha deve ter no mínimo 8 caracteres.";
  }
  if (lower.includes("signup is disabled")) {
    return "Cadastro desabilitado no Supabase. Crie o usuário pelo painel do Supabase.";
  }
  if (lower.includes("email logins are disabled")) {
    return "Login por e-mail desativado no Supabase. Ative em Authentication → Providers → Email.";
  }

  return message;
}
