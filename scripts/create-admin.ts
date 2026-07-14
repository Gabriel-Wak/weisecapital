import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.argv[2];
const password = process.argv[3];
const role = (process.argv[4] ?? "ADMIN") as "ADMIN" | "MANAGER" | "BROKER" | "EDITOR";

async function main() {
  if (!email || !password) {
    console.error("Uso: npm run db:create-admin <email> <senha> [role]");
    process.exit(1);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const tenant = await prisma.tenant.findUnique({
    where: { slug: "weise-capital" },
  });

  if (!tenant) {
    throw new Error('Tenant "weise-capital" não encontrado. Rode npm run db:seed primeiro.');
  }

  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list.users.find((u) => u.email === email);

  let supabaseId: string;

  if (existing) {
    supabaseId = existing.id;
    await supabase.auth.admin.updateUserById(supabaseId, {
      password,
      email_confirm: true,
    });
    console.log(`Usuário Supabase atualizado: ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: email.split("@")[0] },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Falha ao criar usuário no Supabase");
    }

    supabaseId = data.user.id;
    console.log(`Usuário Supabase criado: ${email}`);
  }

  await prisma.user.upsert({
    where: { email },
    update: {
      supabaseId,
      role,
      isActive: true,
    },
    create: {
      supabaseId,
      email,
      name: email.split("@")[0],
      role,
      tenantId: tenant.id,
    },
  });

  console.log("\n✅ Usuário pronto para login!");
  console.log(`   E-mail: ${email}`);
  console.log(`   Role:   ${role}`);
  console.log("\n   Acesse: /auth/login");
}

main()
  .catch((err) => {
    console.error("Erro:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
