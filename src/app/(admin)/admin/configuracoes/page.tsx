import { SettingsForm } from "@/components/admin/settings-form";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) notFound();

  return <SettingsForm tenant={tenant} />;
}
