import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/design-system";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const videos = tenant
    ? await prisma.video.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        orderBy: { order: "asc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Vídeos" description="YouTube, Vimeo e uploads">
        <Button asChild>
          <Link href="/admin/videos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Vídeo
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="border-0 p-4 shadow-sm">
            <h3 className="font-semibold">{video.title}</h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">{video.url}</p>
            <Badge variant="outline" className="mt-2">
              {video.provider}
            </Badge>
          </Card>
        ))}
        {videos.length === 0 && (
          <p className="text-muted-foreground">Nenhum vídeo cadastrado.</p>
        )}
      </div>
    </div>
  );
}
