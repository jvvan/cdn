export function sanitizeUsername(username: string) {
  return username.replace(/[^A-Za-z0-9]/g, "") || null;
}
