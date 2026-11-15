import { db } from "@/db";
import { registrations, formations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSettings } from "@/lib/settings";
import { initiatePayment, paymentConfigured } from "@/lib/payment";
import { DURATIONS, parseDurations } from "@/lib/format";

export const dynamic = "force-dynamic";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function genRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  for (let i = 0; i < 5; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return `HF-${new Date().getFullYear()}-${r}`;
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return Response.json({ error: "Requête invalide." }, { status: 400 });

  const firstName = str(b.firstName, 80);
  const lastName = str(b.lastName, 80);
  const email = str(b.email, 160).toLowerCase();
  const phone = str(b.phone, 40);
  const duration = str(b.duration, 4);
  const formationId = Number(b.formationId);

  if (!firstName || !lastName || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 8) {
    return Response.json({ error: "Merci de renseigner correctement votre nom, email et téléphone." }, { status: 400 });
  }
  if (!(duration in DURATIONS)) return Response.json({ error: "Veuillez choisir une durée de formation." }, { status: 400 });

  const [formation] = await db.select().from(formations).where(eq(formations.id, formationId));
  if (!formation || !formation.active || !parseDurations(formation.durations).includes(duration)) {
    return Response.json({ error: "Formation ou durée indisponible." }, { status: 400 });
  }

  const s = await getSettings();
  const fee = parseInt(s.registration_fee) || 0;
  const method = b.paymentMethod === "mobile_money" ? "mobile_money" : "cash";
  const payPhone = str(b.paymentPhone, 40) || phone;

  let reference = genRef();
  for (let i = 0; i < 5; i++) {
    const [ex] = await db.select({ id: registrations.id }).from(registrations).where(eq(registrations.reference, reference));
    if (!ex) break;
    reference = genRef();
  }

  const [row] = await db
    .insert(registrations)
    .values({
      reference,
      firstName,
      lastName,
      email,
      phone,
      city: str(b.city, 80),
      country: str(b.country, 80) || "Cameroun",
      birthDate: str(b.birthDate, 20),
      level: str(b.level, 120),
      formationId: formation.id,
      formationName: formation.name,
      duration,
      message: str(b.message, 1500),
      paymentMethod: fee > 0 ? method : "",
      paymentStatus: fee > 0 ? "en_attente" : "non_requis",
      amount: fee,
      publicNotice: b.consent === true,
    })
    .returning();

  let paymentMessage = "";
  if (fee > 0 && method === "mobile_money") {
    if (paymentConfigured()) {
      const p = await initiatePayment({ amount: fee, phone: payPhone, reference, description: `Inscription ${formation.name}` });
      if (p.ok) {
        await db.update(registrations).set({ paymentRef: p.providerRef ?? "" }).where(eq(registrations.id, row.id));
        paymentMessage = "Une demande de paiement a été envoyée sur votre téléphone. Validez-la avec votre code secret pour confirmer votre inscription.";
      } else {
        paymentMessage = `${p.message} Vous pourrez relancer le paiement depuis votre Espace candidat.`;
      }
    } else {
      paymentMessage = "Votre demande de paiement Mobile Money sera confirmée par notre équipe, qui vous contactera pour finaliser le règlement.";
    }
  } else if (fee > 0) {
    paymentMessage = "Vous réglerez vos frais d'inscription directement auprès de notre centre.";
  }

  return Response.json({ ok: true, reference, amount: fee, paymentMessage });
}
