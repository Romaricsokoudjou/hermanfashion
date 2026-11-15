import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hf_admin";

function password() {
  return process.env.ADMIN_PASSWORD || "herman-admin";
}

export function adminToken() {
  const secret = process.env.ADMIN_SECRET || "hf-dev-secret";
  return crypto.createHmac("sha256", secret).update("admin:" + password()).digest("hex");
}

export function checkPassword(input: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(password());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAdmin() {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!c) return false;
  const expected = adminToken();
  const a = Buffer.from(c);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
