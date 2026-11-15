export const DURATIONS: Record<string, string> = { "3": "3 mois", "6": "6 mois", "12": "1 an" };

export function durationLabel(code: string) {
  return DURATIONS[code] ?? code;
}

export function parseDurations(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s in DURATIONS);
}

export function splitLines(v: string | null | undefined) {
  return (v ?? "")
    .split(/\r?\n/)
    .map((s) => s.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function formatMoney(n: number, currency = "XAF") {
  return `${n.toLocaleString("fr-FR").replace(/\u202f/g, " ")} ${currency === "XAF" ? "FCFA" : currency}`;
}

export function relativeTime(d: Date | string) {
  const diff = Math.max(0, Date.now() - new Date(d).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  return "";
}

export const GALLERY_CATEGORIES = [
  "Nos établissements",
  "Nos salles de formation",
  "Nos enseignants",
  "Nos apprenants",
  "Travaux pratiques",
  "Coiffure",
  "Onglerie",
  "Maquillage",
  "Soins esthétiques",
  "Massage",
  "Événements",
  "Cérémonies",
  "Réalisations professionnelles",
];

export const REG_STATUS: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours d'étude",
  accepte: "Accepté",
  refuse: "Refusé",
  inscrit: "Inscrit",
};

export const PAY_STATUS: Record<string, string> = {
  non_requis: "Aucun paiement requis",
  en_attente: "En attente",
  paye: "Payé",
  echec: "Échec",
};
