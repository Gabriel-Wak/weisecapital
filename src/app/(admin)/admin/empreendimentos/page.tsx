import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/design-system";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { developmentRepository } from "@/repositories/development.repository";
import { formatCurrency } from "@/lib/utils/format";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function AdminEmpreendimentosPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const result = await developmentRepository.findMany(tenant.id, {
    page: 1,
    pageSize: 50,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empreendimentos"
        description="Gerencie projetos e lançamentos"
      >
        <Button asChild>
          <Link href="/admin/empreendimentos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Empreendimento
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {result.data.map((dev) => (
          <Card key={dev.id} className="border-0 p-6 shadow-sm">
            <Badge variant="outline" className="mb-2">
              {dev.status}
            </Badge>
            <h3 className="text-lg font-semibold">{dev.name}</h3>
            <p className="text-sm text-muted-foreground">
              {dev.neighborhood}, {dev.city}
            </p>
            {dev.minPrice && (
              <p className="mt-2 font-medium text-primary">
                A partir de {formatCurrency(dev.minPrice)}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {dev._count?.properties ?? 0} unidades vinculadas
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
