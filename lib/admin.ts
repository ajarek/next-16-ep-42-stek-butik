export const ADMIN_EMAILS = ["ajarek@poczta.onet.pl"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}