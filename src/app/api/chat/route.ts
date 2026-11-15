import { getFormations, getCenters } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { durationLabel, parseDurations, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { messages?: Msg[] };
  const messages = (body.messages ?? []).filter((m) => m && typeof m.content === "string").slice(-10);
  const last = messages[messages.length - 1]?.content ?? "";
  if (!last) return Response.json({ reply: "Posez-moi votre question, je vous réponds avec plaisir." });

  const [formations, centers, s] = await Promise.all([getFormations(), getCenters(), getSettings()]);
  const fee = parseInt(s.registration_fee) || 0;

  const facts = [
    `HERMAN FASHION est un institut de beauté et centre de formation professionnelle basé à Douala (Cameroun). Ce n'est PAS une école de mode ou de couture.`,
    `Formations : ${formations
      .map((f) => `${f.name} (durées : ${parseDurations(f.durations).map(durationLabel).join(", ")})`)
      .join(" ; ")}.`,
    fee ? `Frais d'inscription : ${formatMoney(fee, s.currency)}.` : `Les frais d'inscription et tarifs sont communiqués par l'équipe (non publiés en ligne).`,
    `Inscription en ligne : page /inscription. Suivi du dossier : page /espace-candidat. Contact : page /contact.`,
    s.contact_phone ? `Téléphone : ${s.contact_phone}.` : "",
    s.contact_email ? `Email : ${s.contact_email}.` : "",
    `Adresse : ${centers[0]?.address || s.contact_address}.`,
  ]
    .filter(Boolean)
    .join("\n");

  // Mode IA (si une clé OpenAI est configurée)
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.4,
          max_tokens: 350,
          messages: [
            {
              role: "system",
              content: `Tu es l'assistante virtuelle de HERMAN FASHION. Réponds en français, de façon chaleureuse, concise et professionnelle.
Règles strictes : n'invente jamais de tarifs, de programmes détaillés, de diplômes ou de dates ; si l'information n'est pas dans les faits ci-dessous, invite à contacter l'équipe ou à utiliser la page Contact. Ne parle jamais de couture, stylisme vestimentaire ou mannequinat.
Faits :
${facts}`,
            },
            ...messages,
          ],
        }),
      });
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return Response.json({ reply });
    } catch {
      // repli sur les réponses intégrées
    }
  }

  // Mode de repli : réponses fondées sur les données du site
  const q = norm(last);
  let reply: string;
  if (/(bonjour|salut|bonsoir|hello|coucou)/.test(q) && q.length < 25) {
    reply = "Bonjour ! Je peux vous renseigner sur nos formations, les durées, l'inscription ou nos coordonnées.";
  } else if (/(inscri|candidat|dossier)/.test(q)) {
    reply = `Vous pouvez vous inscrire en ligne en quelques minutes sur la page « Inscription » (bouton orange en haut de page). ${
      fee ? `Les frais d'inscription sont de ${formatMoney(fee, s.currency)}. ` : ""
    }Après validation, suivez votre dossier dans l'Espace candidat avec votre référence.`;
  } else if (/(prix|tarif|cout|frais|combien|paiement|payer)/.test(q)) {
    reply = fee
      ? `Les frais d'inscription s'élèvent à ${formatMoney(fee, s.currency)}, payables en ligne par Mobile Money. Pour le coût détaillé de chaque formation, notre équipe vous répondra via la page Contact.`
      : "Les tarifs sont communiqués directement par notre équipe. Écrivez-nous via la page Contact et nous reviendrons vers vous rapidement.";
  } else if (/(duree|mois|annee|combien de temps|long)/.test(q)) {
    reply = "Nos formations sont proposées en trois durées : 3 mois, 6 mois ou 1 an, selon la spécialité et votre objectif.";
  } else if (/(contact|telephone|appeler|numero|mail|email|adresse|ou etes|situe|localis|centre)/.test(q)) {
    reply = `Nous sommes basés à ${centers[0]?.address || s.contact_address}.${s.contact_phone ? ` Téléphone : ${s.contact_phone}.` : ""}${
      s.contact_email ? ` Email : ${s.contact_email}.` : ""
    } Vous pouvez aussi nous écrire via la page Contact.`;
  } else if (/(mode|couture|styli|mannequin|vetement)/.test(q)) {
    reply = "HERMAN FASHION est un institut de beauté et de bien-être : nous ne proposons pas de formation en couture ou en stylisme vestimentaire. Nos spécialités sont la coiffure, l'esthétique, l'onglerie, le maquillage, le massage, les cils et le microblading.";
  } else {
    const hit = formations.find((f) => {
      const words = norm(f.name).split(/[^a-z]+/).filter((w) => w.length > 3 && !["professionnelle", "professionnel"].includes(w));
      return words.some((w) => q.includes(w));
    });
    if (hit) {
      reply = `${hit.name} : ${hit.description} Durées disponibles : ${parseDurations(hit.durations).map(durationLabel).join(", ")}. Détails : /formations/${hit.slug}`;
    } else if (/(formation|metier|apprendre|cours|specialit|propos)/.test(q)) {
      reply = `Nos formations : ${formations.map((f) => f.name).join(", ")}. Dites-moi laquelle vous intéresse pour en savoir plus.`;
    } else {
      reply = "Je peux vous renseigner sur nos formations, les durées, l'inscription et nos coordonnées. Pour toute autre demande, notre équipe vous répondra via la page Contact.";
    }
  }
  return Response.json({ reply });
}
