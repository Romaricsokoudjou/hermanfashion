import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken, checkPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  await new Promise((r) => setTimeout(r, 400));
  if (!password || !checkPassword(password)) return Response.json({ error: "Mot de passe incorrect." }, { status: 401 });
  (await cookies()).set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "1",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
