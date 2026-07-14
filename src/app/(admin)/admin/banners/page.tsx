import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/design-system";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const banners = tenant
    ? await prisma.banner.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        orderBy: { order: "asc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Banners" description="Gerencie banners desktop, tablet e mobile">
        <Button asChild>
          <Link href="/admin/banners/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Banner
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden border-0 shadow-sm">
            <div className="relative aspect-video">
              <Image
                src={banner.imageDesktop}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{banner.title}</h3>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline">{banner.position}</Badge>
                <Badge variant={banner.isActive ? "default" : "secondary"}>
                  {banner.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
