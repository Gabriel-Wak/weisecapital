import { NextResponse } from "next/server";
import { propertySearchSchema } from "@/lib/validators";
import { propertyService } from "@/services/property.service";
import { siteConfig } from "@/config/site";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const parsed = propertySearchSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const result = await propertyService.search(
    siteConfig.defaultTenantSlug,
    parsed.data
  );

  return NextResponse.json(result);
}
