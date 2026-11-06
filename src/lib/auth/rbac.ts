import type { AppRole } from "@/types/domain";

export type PermissionAction =
  | "dashboard:view"
  | "products:read"
  | "products:write"
  | "content:read"
  | "content:write"
  | "articles:write"
  | "rfq:read"
  | "rfq:update"
  | "samples:read"
  | "samples:update"
  | "notes:write"
  | "users:read"
  | "users:manage"
  | "roles:assign"
  | "settings:write"
  | "documents:manage";

const ROLE_PERMISSIONS: Record<AppRole, ReadonlySet<PermissionAction>> = {
  SUPER_ADMIN: new Set<PermissionAction>([
    "dashboard:view",
    "products:read",
    "products:write",
    "content:read",
    "content:write",
    "articles:write",
    "rfq:read",
    "rfq:update",
    "samples:read",
    "samples:update",
    "notes:write",
    "users:read",
    "users:manage",
    "roles:assign",
    "settings:write",
    "documents:manage",
  ]),
  ADMIN_CMS: new Set<PermissionAction>([
    "dashboard:view",
    "products:read",
    "products:write",
    "content:read",
    "content:write",
    "articles:write",
    "rfq:read",
    "samples:read",
    "documents:manage",
  ]),
  SALES: new Set<PermissionAction>([
    "dashboard:view",
    "products:read",
    "rfq:read",
    "rfq:update",
    "samples:read",
    "samples:update",
    "notes:write",
  ]),
};

export function hasPermission(
  role: AppRole | null | undefined,
  action: PermissionAction
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.has(action) ?? false;
}

export function canAssignRole(
  actorRole: AppRole | null | undefined,
  targetRole: AppRole
): boolean {
  // Only SUPER_ADMIN can assign or modify user roles.
  // ADMIN_CMS cannot grant itself SUPER_ADMIN access.
  // SALES cannot change any user's role.
  if (actorRole !== "SUPER_ADMIN") {
    return false;
  }
  return (
    targetRole === "SUPER_ADMIN" ||
    targetRole === "ADMIN_CMS" ||
    targetRole === "SALES"
  );
}

export function assertPermission(
  role: AppRole | null | undefined,
  action: PermissionAction
): void {
  if (!hasPermission(role, action)) {
    throw new Error(
      `Authorization failed: role ${role ?? "ANONYMOUS"} is not permitted to perform ${action}.`
    );
  }
}
