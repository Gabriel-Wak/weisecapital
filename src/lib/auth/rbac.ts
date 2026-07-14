import type { UserRole } from "@prisma/client";

type Permission =
  | "properties:read"
  | "properties:write"
  | "properties:delete"
  | "developments:read"
  | "developments:write"
  | "developments:delete"
  | "leads:read"
  | "leads:write"
  | "leads:delete"
  | "users:read"
  | "users:write"
  | "users:delete"
  | "blog:read"
  | "blog:write"
  | "blog:delete"
  | "banners:read"
  | "banners:write"
  | "settings:read"
  | "settings:write"
  | "reports:read"
  | "crm:read"
  | "crm:write";

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    "properties:read",
    "properties:write",
    "properties:delete",
    "developments:read",
    "developments:write",
    "developments:delete",
    "leads:read",
    "leads:write",
    "leads:delete",
    "users:read",
    "users:write",
    "users:delete",
    "blog:read",
    "blog:write",
    "blog:delete",
    "banners:read",
    "banners:write",
    "settings:read",
    "settings:write",
    "reports:read",
    "crm:read",
    "crm:write",
  ],
  MANAGER: [
    "properties:read",
    "properties:write",
    "properties:delete",
    "developments:read",
    "developments:write",
    "leads:read",
    "leads:write",
    "users:read",
    "blog:read",
    "blog:write",
    "banners:read",
    "banners:write",
    "reports:read",
    "crm:read",
    "crm:write",
  ],
  BROKER: [
    "properties:read",
    "leads:read",
    "leads:write",
    "crm:read",
    "crm:write",
  ],
  EDITOR: [
    "properties:read",
    "blog:read",
    "blog:write",
    "banners:read",
    "banners:write",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function requirePermission(
  role: UserRole,
  permission: Permission
): void {
  if (!hasPermission(role, permission)) {
    throw new Error("Permissão negada");
  }
}

export type { Permission };
