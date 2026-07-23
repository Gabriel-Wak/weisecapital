import sharp from "sharp";
import path from "path";

const src = path.join("public", "brand", "weise-logo.png");
const outNavy = path.join("public", "brand", "weise-logo.png");
const outWhite = path.join("public", "brand", "weise-logo-white.png");

async function removeBgAndExport() {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const navy = Buffer.from(data);
  const white = Buffer.from(data);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isBg = r > 200 && g > 200 && b > 200;

    if (isBg) {
      navy[i + 3] = 0;
      white[i + 3] = 0;
    } else {
      white[i] = 255;
      white[i + 1] = 255;
      white[i + 2] = 255;
    }
  }

  await sharp(navy, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outNavy);

  await sharp(white, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outWhite);

  const meta = await sharp(outNavy).metadata();
  console.log("done", {
    width: meta.width,
    height: meta.height,
    hasAlpha: meta.hasAlpha,
    channels: meta.channels,
  });
}

removeBgAndExport();
