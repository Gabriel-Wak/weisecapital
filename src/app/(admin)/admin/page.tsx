import { StatCard, PageHeader } from "@/components/shared/design-system";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  TrendingUp,
  Eye,
  UserPlus,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { propertyTypeLabel } from "@/lib/utils/format";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    properties,
    leads,
    views,
    brokers,
    recentLeads,
    recentAudit,
    allLeads,
    propertiesByType,
  ] = await Promise.all([
    prisma.property.count({ where: { tenantId: tenant.id, deletedAt: null } }),
    prisma.lead.count({ where: { tenantId: tenant.id, deletedAt: null } }),
    prisma.property.aggregate({
      where: { tenantId: tenant.id },
      _sum: { views: true },
    }),
    prisma.user.count({
      where: { tenantId: tenant.id, role: "BROKER", isActive: true },
    }),
    prisma.lead.findMany({
      where: { tenantId: tenant.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { property: true },
    }),
    prisma.auditLog.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
    prisma.lead.findMany({
      where: { tenantId: tenant.id, createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.property.groupBy({
      by: ["type"],
      where: { tenantId: tenant.id, deletedAt: null },
      _count: true,
    }),
  ]);

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const leadsByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.getMonth();
    const year = d.getFullYear();
    const count = allLeads.filter(
      (l) =>
        l.createdAt.getMonth() === month &&
        l.createdAt.getFullYear() === year
    ).length;
    return { month: monthNames[month], count };
  });

  return {
    stats: {
      properties,
      leads,
      views: views._sum.views ?? 0,
      brokers,
    },
    recentLeads,
    recentAudit,
    leadsByMonth,
    propertiesByType: propertiesByType.map((p) => ({
      type: propertyTypeLabel(p.type),
      count: p._count,
    })),
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const cards = [
    {
      title: "Imóveis",
      value: data?.stats.properties ?? 0,
      icon: Building2,
      description: "Total cadastrados",
    },
    {
      title: "Leads",
      value: data?.stats.leads ?? 0,
      icon: Users,
      description: "Leads recebidos",
    },
    {
      title: "Visualizações",
      value: data?.stats.views ?? 0,
      icon: Eye,
      description: "Total de views",
    },
    {
      title: "Corretores",
      value: data?.stats.brokers ?? 0,
      icon: TrendingUp,
      description: "Ativos",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua imobiliária"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {data && (
        <DashboardCharts
          leadsByMonth={data.leadsByMonth}
          propertiesByType={data.propertiesByType}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4" />
              Leads recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.recentLeads.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum lead ainda.</p>
            )}
            {data?.recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.property?.title ?? lead.phone}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{lead.source}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(lead.createdAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Atividades recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.recentAudit.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade registrada.
              </p>
            )}
            {data?.recentAudit.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">
                    {log.action} — {log.entity}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.user?.name ?? "Sistema"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(log.createdAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
