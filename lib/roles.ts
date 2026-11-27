/**
 * Role helpers shared by gated server components.
 *
 * Roles come from Better Auth's admin plugin (`admin()` in `lib/auth.ts`):
 * "teacher", "student", or "admin". Self-registered users have no role until
 * they pick one at `/onboarding/role`.
 */
export type AppRole = "teacher" | "student" | "admin";

/** Roles a user can pick for themselves during onboarding. */
export const PICKABLE_ROLES = ["teacher", "student"] as const;

/**
 * Normalize a session user's `role` (string, comma-separated string, or
 * missing) into a list of known roles.
 */
export function parseRoles(role: unknown): AppRole[] {
  if (typeof role !== "string" || role.length === 0) {
    return [];
  }

  return role
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is AppRole =>
      value === "teacher" || value === "student" || value === "admin"
    );
}

/** Whether the user holds at least one of the required roles. */
export function hasAnyRole(role: unknown, required: readonly AppRole[]): boolean {
  const roles = parseRoles(role);
  return required.some((value) => roles.includes(value));
}
