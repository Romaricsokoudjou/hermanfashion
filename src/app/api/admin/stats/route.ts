import { db } from "@/db";
import { registrations, messages, formations, teachers, gallery, testimonials } from "@/db/schema";
import { count, eq, sum } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { paymentConfigured } from "@/lib/payment";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const c = async (t: typeof registrations | typeof messages | typeof formations | typeof teachers | typeof gallery | typeof testimonials) =>
    (await db.select({ n: count() }).from(t))[0].n;
  const [newRegs] = await db.select({ n: count() }).from(registrations).where(eq(registrations.status, "nouveau"));
  const [unread] = await db.select({ n: count() }).from(messages).where(eq(messages.read, false));
  const [paid] = await db.select({ total: sum(registrations.amount) }).from(registrations).where(eq(registrations.paymentStatus, "paye"));
  return Response.json({
    registrations: await c(registrations),
    newRegistrations: newRegs.n,
    unreadMessages: unread.n,
    revenue: Number(paid.total ?? 0),
    formations: await c(formations),
    teachers: await c(teachers),
    gallery: await c(gallery),
    testimonials: await c(testimonials),
    paymentGateway: paymentConfigured(),
    ai: !!process.env.OPENAI_API_KEY,
  });
}
