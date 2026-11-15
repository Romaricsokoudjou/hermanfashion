import { db } from "@/db";
import { messages } from "@/db/schema";

export const dynamic = "force-dynamic";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(b.name, 100);
  const email = str(b.email, 160);
  const message = str(b.message, 3000);
  if (!name || !message || (email && !/^\S+@\S+\.\S+$/.test(email))) {
    return Response.json({ error: "Merci de renseigner votre nom et votre message." }, { status: 400 });
  }
  await db.insert(messages).values({ name, email, phone: str(b.phone, 40), subject: str(b.subject, 150), message });
  return Response.json({ ok: true });
}
