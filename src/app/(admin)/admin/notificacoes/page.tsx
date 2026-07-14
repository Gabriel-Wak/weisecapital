import { PageHeader } from "@/components/shared/design-system";
import { NotificationsList } from "@/components/admin/notifications-list";
import { requireSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const session = await requireSession();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Alertas de leads, sistema e atividades"
      />
      <NotificationsList notifications={notifications} />
    </div>
  );
}
