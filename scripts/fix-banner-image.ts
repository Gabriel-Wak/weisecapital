/**
 * Re-upload a valid image for an existing banner (fixes UTF-8-corrupted WebPs).
 *
 * Usage:
 *   npx tsx scripts/fix-banner-image.ts <bannerId> <localImagePath>
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";
import { uploadToStorage } from "../src/lib/supabase/storage";

async function main() {
  const [bannerId, imagePath] = process.argv.slice(2);
  if (!bannerId || !imagePath) {
    console.error("Usage: npx tsx scripts/fix-banner-image.ts <bannerId> <localImagePath>");
    process.exit(1);
  }

  const abs = path.resolve(imagePath);
  if (!fs.existsSync(abs)) {
    console.error("File not found:", abs);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner) {
    console.error("Banner not found:", bannerId);
    process.exit(1);
  }

  const input = fs.readFileSync(abs);
  const webp = await sharp(input)
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  if (webp.subarray(0, 4).toString() !== "RIFF" || webp.subarray(8, 12).toString() !== "WEBP") {
    throw new Error("Generated WebP header is invalid");
  }

  const filename = `banners/${banner.tenantId}/${nanoid()}.webp`;
  const { url } = await uploadToStorage(webp, filename, "image/webp");

  // Verify remote file is not UTF-8 corrupted
  const res = await fetch(url);
  const remote = Buffer.from(await res.arrayBuffer());
  const ok =
    remote.subarray(0, 4).toString() === "RIFF" &&
    remote.subarray(8, 12).toString() === "WEBP";
  if (!ok) {
    throw new Error(`Upload still corrupted. Header: ${remote.subarray(0, 16).toString("hex")}`);
  }

  await prisma.banner.update({
    where: { id: bannerId },
    data: { imageDesktop: url },
  });

  console.log("Updated banner", bannerId);
  console.log("New URL:", url);
  console.log("Remote bytes:", remote.length, "valid WebP:", ok);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
