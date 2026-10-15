export function canAccessDeveloperTools(
  role?: string | null,
  permissions?: string[] | null
): boolean {
  return (
    role === "api_user" && Boolean(permissions?.includes("reseller.api_access"))
  );
}
