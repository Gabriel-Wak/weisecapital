"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/actions/development.actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
};

export function NotificationsList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [isPending, startTransition] = useTransition();

  function markRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
    });
  }

  function markAllRead() {
    startTransition(async () => {
      const result = await markAllNotificationsRead();
      if (result.success) toast.success("Todas marcadas como lidas");
    });
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      {unread > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={isPending}>
            Marcar todas como lidas
          </Button>
        </div>
      )}
      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma notificação
        </p>
      ) : (
        notifications.map((n) => (
          <Card
            key={n.id}
            className={`border-0 p-4 shadow-sm ${!n.isRead ? "border-l-4 border-l-primary" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{n.title}</h3>
                  <Badge variant="outline">{n.type}</Badge>
                  {!n.isRead && <Badge>Nova</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              {!n.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markRead(n.id)}
                  disabled={isPending}
                >
                  Marcar lida
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
