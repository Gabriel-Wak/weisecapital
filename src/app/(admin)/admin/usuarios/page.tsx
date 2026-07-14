import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/design-system";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteUser } from "@/actions/admin.actions";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { USER_ROLES } from "@/constants";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const users = tenant
    ? await prisma.user.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const roleLabel = (role: string) =>
    USER_ROLES.find((r) => r.value === role)?.label ?? role;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie administradores, gerentes e corretores"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CRECI</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{roleLabel(user.role)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>{user.creci ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <DeleteButton
                    id={user.id}
                    label={user.name}
                    onDelete={deleteUser}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
