import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export async function GET() {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: siteConfig.defaultTenantSlug },
      select: { id: true, name: true, isActive: true },
    });

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      tenant: tenant ? { name: tenant.name, active: tenant.isActive } : null,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 503 }
    );
  }
}
