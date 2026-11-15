import { db } from "@/db";
import { registrations } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { checkPayment, initiatePayment, paymentConfigured } from "@/lib/payment";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { reference?: string; email?: string; action?: string; phone?: string };
  const reference = (b.reference ?? "").trim().toUpperCase();
  const email = (b.email ?? "").trim().toLowerCase();
  if (!reference || !email) return Response.json({ error: "Référence et email requis." }, { status: 400 });

  let [r] = await db
    .select()
    .from(registrations)
    .where(and(eq(registrations.reference, reference), eq(registrations.email, email)));
  if (!r) return Response.json({ error: "Aucun dossier ne correspond à ces informations." }, { status: 404 });

  let note = "";
  if (b.action === "check" && r.paymentRef && r.paymentStatus !== "paye") {
    const st = await checkPayment(r.paymentRef);
    if (st !== r.paymentStatus) {
      [r] = await db.update(registrations).set({ paymentStatus: st }).where(eq(registrations.id, r.id)).returning();
    }
    note = st === "paye" ? "Paiement confirmé. Merci !" : "Paiement toujours en attente de validation.";
  }

  if (b.action === "pay" && r.paymentStatus !== "paye" && r.amount > 0) {
    if (!paymentConfigured()) {
      note = "Le paiement en ligne sera confirmé par notre équipe, qui vous contactera.";
    } else {
      const p = await initiatePayment({
        amount: r.amount,
        phone: (b.phone || r.phone).toString(),
        reference: `${r.reference}-${Date.now().toString().slice(-5)}`,
        description: `Inscription ${r.formationName}`,
      });
      if (p.ok) {
        [r] = await db
          .update(registrations)
          .set({ paymentRef: p.providerRef ?? "", paymentStatus: "en_attente", paymentMethod: "mobile_money" })
          .where(eq(registrations.id, r.id))
          .returning();
      }
      note = p.message;
    }
  }

  return Response.json({
    note,
    registration: {
      reference: r.reference,
      firstName: r.firstName,
      lastName: r.lastName,
      formationName: r.formationName,
      duration: r.duration,
      status: r.status,
      paymentStatus: r.paymentStatus,
      paymentMethod: r.paymentMethod,
      amount: r.amount,
      createdAt: r.createdAt,
      canPayOnline: paymentConfigured() && r.amount > 0 && r.paymentStatus !== "paye",
    },
  });
}
