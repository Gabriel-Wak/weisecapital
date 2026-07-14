import { NextResponse } from "next/server";
import { serializeProperty } from "@/lib/utils/serialize";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: { media: { orderBy: { order: "asc" }, take: 1 } },
  });

  if (!property) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json(serializeProperty(property));
}
