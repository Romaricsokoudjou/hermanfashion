import { db } from "@/db";
import { registrations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getFormations } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { relativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

type Item = { kind: "registration" | "open"; title: string; text: string; meta?: string; href?: string };

export async function GET() {
  const s = await getSettings();
  if (s.notifications_enabled === "0") return Response.json({ items: [] });

  // Inscriptions réelles dont le candidat a donné son accord pour l'affichage (prénom + initiale uniquement).
  const rows = await db
    .select()
    .from(registrations)
    .where(eq(registrations.publicNotice, true))
    .orderBy(desc(registrations.createdAt))
    .limit(15);

  const real: Item[] = rows.map((r) => ({
    kind: "registration",
    title: `${r.firstName} ${r.lastName.charAt(0).toUpperCase()}.${r.city ? ` · ${r.city}` : ""}`,
    text: `vient de s'inscrire à « ${r.formationName} »`,
    meta: relativeTime(r.createdAt) || undefined,
    href: r.formationId ? undefined : "/inscription",
  }));

  // Complément honnête : formations ouvertes aux inscriptions.
  const formations = await getFormations();
  const open: Item[] = formations.map((f) => ({
    kind: "open",
    title: "Inscriptions ouvertes",
    text: `${f.name} — réservez votre place dès maintenant`,
    meta: "S'inscrire en ligne",
    href: `/inscription?formation=${f.slug}`,
  }));

  // Alternance : inscriptions réelles en priorité, entrecoupées d'invitations à s'inscrire.
  const items: Item[] = [];
  const max = Math.max(real.length, open.length);
  for (let i = 0; i < max; i++) {
    if (real[i]) items.push(real[i]);
    if (open[i] && (real.length === 0 || i % 2 === 0)) items.push(open[i]);
  }
  return Response.json({ items });
}
