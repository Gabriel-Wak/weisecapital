import { StatCard, PageHeader } from "@/components/shared/design-system";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Building2,
  Users,
  Eye,
  Landmark,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatCurrency, propertyTypeLabel } from "@/lib/utils/format";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    properties,
    leads,
    leadsThisMonth,
    views,
    brokers,
    developments,
    blogPosts,
    recentLeads,
    recentAudit,
    allLeads,
    propertiesByType,
    topProperties,
    pipelineCounts,
  ] = await Promise.all([
    prisma.property.count({ where: { tenantId: tenant.id, deletedAt: null } }),
    prisma.lead.count({ where: { tenantId: tenant.id, deletedAt: null } }),
    prisma.lead.count({
      where: {
        tenantId: tenant.id,
        deletedAt: null,
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.property.aggregate({
      where: { tenantId: tenant.id, deletedAt: null },
      _sum: { views: true },
    }),
    prisma.user.count({
      where: { tenantId: tenant.id, role: "BROKER", isActive: true, deletedAt: null },
    }),
    prisma.development.count({
      where: { tenantId: tenant.id, deletedAt: null },
    }),
    prisma.blogPost.count({
      where: { tenantId: tenant.id, deletedAt: null, isPublished: true },
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
      take: 8,
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
    prisma.property.findMany({
      where: { tenantId: tenant.id, deletedAt: null },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, code: true, title: true, slug: true, views: true, price: true },
    }),
    prisma.pipelineStage.findMany({
      where: { tenantId: tenant.id },
      include: { _count: { select: { leads: { where: { deletedAt: null } } } } },
      orderBy: { order: "asc" },
    }),
  ]);

  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  const leadsByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.getMonth();
    const year = d.getFullYear();
    const count = allLeads.filter(
      (l) =>
        l.createdAt.getMonth() === month && l.createdAt.getFullYear() === year
    ).length;
    return { month: monthNames[month], count };
  });

  const portfolioValue = await prisma.property.aggregate({
    where: { tenantId: tenant.id, deletedAt: null, status: "AVAILABLE" },
    _sum: { price: true },
  });

  return {
    stats: {
      properties,
      leads,
      leadsThisMonth,
      views: views._sum.views ?? 0,
      brokers,
      developments,
      blogPosts,
      portfolioValue: Number(portfolioValue._sum.price ?? 0),
    },
    recentLeads,
    recentAudit,
    leadsByMonth,
    propertiesByType: propertiesByType.map((p) => ({
      type: propertyTypeLabel(p.type),
      count: p._count,
    })),
    topProperties: topProperties.map((p) => ({
      ...p,
      price: Number(p.price),
    })),
    pipelineCounts,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const cards = [
    {
      title: "Imóveis ativos",
      value: data?.stats.properties ?? 0,
      icon: Building2,
      description: "Cadastrados no catálogo",
    },
    {
      title: "Leads",
      value: data?.stats.leads ?? 0,
      icon: Users,
      description: `${data?.stats.leadsThisMonth ?? 0} este mês`,
    },
    {
      title: "Visualizações",
      value: data?.stats.views ?? 0,
      icon: Eye,
      description: "Total nos imóveis",
    },
    {
      title: "Empreendimentos",
      value: data?.stats.developments ?? 0,
      icon: Landmark,
      description: `${data?.stats.brokers ?? 0} corretores ativos`,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Dados em tempo real do banco de dados"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {data && data.stats.portfolioValue > 0 && (
        <Card className="border-0 bg-primary/5 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Valor do portfólio (imóveis disponíveis)
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.stats.portfolioValue)}
                </p>
              </div>
            </div>
            <Badge variant="outline">{data.stats.blogPosts} artigos publicados</Badge>
          </CardContent>
        </Card>
      )}

      {data && (
        <DashboardCharts
          leadsByMonth={data.leadsByMonth}
          propertiesByType={data.propertiesByType}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">CRM — Leads por estágio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.pipelineCounts.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem estágios configurados.</p>
            )}
            {data?.pipelineCounts.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-sm">{stage.name}</span>
                </div>
                <Badge variant="secondary">{stage._count.leads}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Imóveis mais visualizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.topProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum imóvel cadastrado.</p>
            )}
            {data?.topProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <Link
                    href={`/admin/imoveis/${property.id}`}
                    className="font-medium hover:text-primary"
                  >
                    {property.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {property.code} · {formatCurrency(property.price)}
                  </p>
                </div>
                <Badge variant="outline">{property.views} views</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

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
                    {lead.property?.title ?? lead.phone ?? lead.email}
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
