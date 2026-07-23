/**
 * Generate valid WebP placeholders and replace corrupted banner images.
 * Usage: npx tsx scripts/repair-corrupted-banners.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import sharp from "sharp";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";
import { uploadToStorage } from "../src/lib/supabase/storage";

const STOCK = [
  // Luxury coastal / modern home (Unsplash)
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80",
];

function isValidWebp(buf: Buffer) {
  return buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
}

async function download(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const prisma = new PrismaClient();
  const banners = await prisma.banner.findMany({
    where: { deletedAt: null, position: "HOME_HERO" },
    orderBy: { order: "asc" },
  });

  if (!banners.length) {
    console.log("No banners found");
    await prisma.$disconnect();
    return;
  }

  for (let i = 0; i < banners.length; i++) {
    const banner = banners[i]!;
    const stockUrl = STOCK[i % STOCK.length]!;
    console.log(`\nRepairing "${banner.title}" (${banner.id})`);

    const raw = await download(stockUrl);
    const webp = await sharp(raw)
      .resize(1920, 1080, { fit: "cover" })
      .webp({ quality: 85 })
      .toBuffer();

    if (!isValidWebp(webp)) throw new Error("Local WebP invalid");

    const filename = `banners/${banner.tenantId}/${nanoid()}.webp`;
    const { url } = await uploadToStorage(webp, filename, "image/webp");

    const remoteRes = await fetch(url);
    const remote = Buffer.from(await remoteRes.arrayBuffer());
    if (!isValidWebp(remote)) {
      throw new Error(
        `Remote still corrupted for ${banner.id}. hex=${remote.subarray(0, 16).toString("hex")}`
      );
    }

    await prisma.banner.update({
      where: { id: banner.id },
      data: { imageDesktop: url },
    });

    console.log("OK", url, "bytes", remote.length);
  }

  await prisma.$disconnect();
  console.log("\nAll banners repaired.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
