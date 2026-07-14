import { PageHeader } from "@/components/shared/design-system";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const leads = tenant
    ? await prisma.lead.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        include: { broker: true, property: true, stage: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Todos os leads recebidos" />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Imóvel</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{lead.phone}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </TableCell>
                <TableCell>{lead.property?.title ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{lead.source}</Badge>
                </TableCell>
                <TableCell>{lead.stage?.name ?? lead.status}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(lead.createdAt, { addSuffix: true, locale: ptBR })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
