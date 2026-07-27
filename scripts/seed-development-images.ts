/**
 * Attach cover images to developments that have no media.
 * Usage: npx tsx scripts/seed-development-images.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import sharp from "sharp";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";
import { uploadToStorage } from "../src/lib/supabase/storage";

const STOCK = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
];

async function main() {
  const prisma = new PrismaClient();
  const developments = await prisma.development.findMany({
    where: { deletedAt: null },
    include: { media: { take: 1 } },
  });

  const withoutMedia = developments.filter((d) => d.media.length === 0);
  if (!withoutMedia.length) {
    console.log("All developments already have images");
    await prisma.$disconnect();
    return;
  }

  for (let i = 0; i < withoutMedia.length; i++) {
    const dev = withoutMedia[i]!;
    const stockUrl = STOCK[i % STOCK.length]!;
    console.log(`Seeding image for "${dev.name}"`);

    const res = await fetch(stockUrl);
    if (!res.ok) throw new Error(`Download failed: ${stockUrl}`);
    const raw = Buffer.from(await res.arrayBuffer());
    const webp = await sharp(raw)
      .resize(1600, 1000, { fit: "cover" })
      .webp({ quality: 85 })
      .toBuffer();

    const filename = `developments/${dev.tenantId}/${nanoid()}.webp`;
    const { url } = await uploadToStorage(webp, filename, "image/webp");

    await prisma.media.create({
      data: {
        url,
        type: "IMAGE",
        mimeType: "image/webp",
        order: 0,
        developmentId: dev.id,
        alt: dev.name,
      },
    });

    console.log("OK", url);
  }

  await prisma.$disconnect();
  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
