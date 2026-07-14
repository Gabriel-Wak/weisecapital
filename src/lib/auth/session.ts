import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import type { SessionUser } from "@/types";

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: {
      id: true,
      supabaseId: true,
      email: true,
      name: true,
      role: true,
      tenantId: true,
      avatar: true,
      isActive: true,
    },
  });

  if (!dbUser || !dbUser.isActive) return null;

  return {
    id: dbUser.id,
    supabaseId: dbUser.supabaseId,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    tenantId: dbUser.tenantId,
    avatar: dbUser.avatar,
  };
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");
  return session;
}
