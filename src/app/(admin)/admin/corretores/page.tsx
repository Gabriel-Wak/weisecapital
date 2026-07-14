import { PageHeader } from "@/components/shared/design-system";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function CorretoresPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const brokers = tenant
    ? await prisma.user.findMany({
        where: { tenantId: tenant.id, role: "BROKER", deletedAt: null },
        include: { _count: { select: { properties: true, leads: true } } },
      })
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Corretores" description="Equipe de vendas e performance" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brokers.map((broker) => (
          <Card key={broker.id} className="border-0 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {broker.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{broker.name}</h3>
                <p className="text-sm text-muted-foreground">{broker.email}</p>
                {broker.creci && (
                  <p className="text-xs text-muted-foreground">CRECI {broker.creci}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-lg font-bold">{broker._count.properties}</p>
                <p className="text-xs text-muted-foreground">Imóveis</p>
              </div>
              <div>
                <p className="text-lg font-bold">{broker._count.leads}</p>
                <p className="text-xs text-muted-foreground">Leads</p>
              </div>
              <Badge variant={broker.isActive ? "default" : "secondary"}>
                {broker.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
