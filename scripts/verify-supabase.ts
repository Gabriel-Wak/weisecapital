/**
 * Verifica conexão com Supabase PostgreSQL.
 * Uso: npx tsx scripts/verify-supabase.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
    console.log("✅ Conexão OK:", result[0]?.now);
    const tenants = await prisma.tenant.count();
    console.log(`✅ Tenants no banco: ${tenants}`);
  } catch (error) {
    console.error("❌ Falha na conexão:");
    console.error(error instanceof Error ? error.message : error);
    console.log("\n📋 Verifique no painel Supabase:");
    console.log("   https://supabase.com/dashboard/project/hmrlwxoykpiddktnvxlz/settings/database");
    console.log("   1. Copie a connection string (Session mode) para DIRECT_URL");
    console.log("   2. Copie a connection string (Transaction mode) para DATABASE_URL");
    console.log("   3. Settings → API → copie anon key e service role key");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
