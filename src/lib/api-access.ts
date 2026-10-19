export function canAccessDeveloperTools(
  role?: string | null,
  _permissions?: string[] | null
): boolean {
  return role === "api_user";
}
