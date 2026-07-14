import { PageHeader } from "@/components/shared/design-system";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const [properties, leads] = tenant
    ? await Promise.all([
        prisma.property.findMany({
          where: { tenantId: tenant.id, deletedAt: null },
          select: { code: true, title: true, price: true, status: true, city: true },
        }),
        prisma.lead.findMany({
          where: { tenantId: tenant.id, deletedAt: null },
          select: { name: true, email: true, phone: true, source: true, createdAt: true },
        }),
      ])
    : [[], []];

  const propertiesCsv = [
    "codigo,titulo,preco,status,cidade",
    ...properties.map(
      (p) =>
        `${p.code},"${p.title}",${p.price},${p.status},${p.city}`
    ),
  ].join("\n");

  const leadsCsv = [
    "nome,email,telefone,origem,data",
    ...leads.map(
      (l) =>
        `"${l.name}",${l.email ?? ""},${l.phone ?? ""},${l.source},${format(l.createdAt, "yyyy-MM-dd", { locale: ptBR })}`
    ),
  ].join("\n");

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" description="Exportação de dados em CSV" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 p-6 shadow-sm">
          <h3 className="font-semibold">Imóveis</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {properties.length} registros
          </p>
          <Button className="mt-4" asChild>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(propertiesCsv)}`}
              download="imoveis.csv"
            >
              Exportar CSV
            </a>
          </Button>
        </Card>
        <Card className="border-0 p-6 shadow-sm">
          <h3 className="font-semibold">Leads</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} registros
          </p>
          <Button className="mt-4" asChild>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(leadsCsv)}`}
              download="leads.csv"
            >
              Exportar CSV
            </a>
          </Button>
        </Card>
      </div>
    </div>
  );
}
