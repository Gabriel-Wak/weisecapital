import { PageHeader } from "@/components/shared/design-system";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const appointments = tenant
    ? await prisma.appointment.findMany({
        where: {
          broker: { tenantId: tenant.id },
          startAt: { gte: new Date() },
        },
        include: { broker: true, client: true },
        orderBy: { startAt: "asc" },
        take: 20,
      })
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Agenda" description="Visitas e compromissos agendados" />

      <div className="space-y-3">
        {appointments.length === 0 && (
          <Card className="border-0 p-8 text-center text-muted-foreground shadow-sm">
            Nenhum compromisso agendado.
          </Card>
        )}
        {appointments.map((apt) => (
          <Card key={apt.id} className="flex items-center justify-between border-0 p-4 shadow-sm">
            <div>
              <h3 className="font-semibold">{apt.title}</h3>
              <p className="text-sm text-muted-foreground">
                {apt.client?.name ?? apt.description ?? "—"} · {apt.broker.name}
              </p>
            </div>
            <Badge variant="outline">
              {format(apt.startAt, "dd MMM yyyy HH:mm", { locale: ptBR })}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
