import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { uploadToStorage } from "@/lib/supabase/storage";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "uploads";

    if (!file) {
      return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(buffer)
      .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Guard against binary corruption before we hit storage
    if (webp.subarray(0, 4).toString() !== "RIFF" || webp.subarray(8, 12).toString() !== "WEBP") {
      return NextResponse.json({ error: "Falha ao gerar WebP válido" }, { status: 500 });
    }

    const filename = `${folder}/${session.tenantId}/${nanoid()}.webp`;
    const { url, path } = await uploadToStorage(webp, filename, "image/webp");

    const metadata = await sharp(webp).metadata();

    return NextResponse.json({
      url,
      path,
      mimeType: "image/webp",
      size: webp.length,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload falhou" },
      { status: 500 }
    );
  }
}
