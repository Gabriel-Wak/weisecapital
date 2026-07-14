import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { PropertyDeleteButton } from "@/components/admin/property-delete-button";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import {
  formatCurrency,
  propertyTypeLabel,
  propertyStatusLabel,
} from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const properties = tenant
    ? await prisma.property.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        include: { broker: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Imóveis</h2>
          <p className="text-muted-foreground">
            Gerencie o catálogo de imóveis
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/imoveis/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar imóveis..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Corretor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nenhum imóvel cadastrado. Execute o seed para popular dados.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-mono text-sm">
                    {property.code}
                  </TableCell>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{propertyTypeLabel(property.type)}</TableCell>
                  <TableCell>{formatCurrency(property.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {propertyStatusLabel(property.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.broker?.name ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/imoveis/${property.id}`}>Editar</Link>
                      </Button>
                      <PropertyDeleteButton
                        id={property.id}
                        title={property.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
