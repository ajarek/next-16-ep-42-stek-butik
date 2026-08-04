export const ADMIN_EMAILS = ["ajarek@poczta.onet.pl", "ajarek2101@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}