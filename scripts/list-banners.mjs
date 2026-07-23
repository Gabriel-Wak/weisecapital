import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rows = await prisma.banner.findMany({
  where: { deletedAt: null },
  select: { id: true, title: true, isActive: true, imageDesktop: true, position: true },
  orderBy: { order: "asc" },
});
console.log(JSON.stringify(rows, null, 2));
await prisma.$disconnect();
