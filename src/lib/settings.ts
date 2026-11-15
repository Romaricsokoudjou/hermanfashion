import { db } from "@/db";
import { settings } from "@/db/schema";
import { px } from "./images";

export const SETTING_DEFAULTS: Record<string, string> = {
  hero_image: px(36436445, 1800),
  intro_image: px(7446693, 1000),
  stat_learners: "",
  stat_specialties: "",
  stat_teachers: "",
  stat_years: "",
  video1_url: "",
  video2_url: "",
  video3_url: "",
  registration_fee: "",
  currency: "XAF",
  contact_phone: "",
  contact_whatsapp: "",
  contact_email: "",
  contact_address: "Douala, Cameroun",
  opening_hours: "",
  facebook_url: "",
  instagram_url: "",
  tiktok_url: "",
  youtube_url: "",
  notifications_enabled: "1",
  inst_history:
    "HERMAN FASHION est un institut de beauté et un centre de formation professionnelle installé à Douala, au Cameroun. Né de la passion pour les métiers de la beauté, de l'esthétique, de la coiffure et du bien-être, l'établissement accompagne celles et ceux qui souhaitent transformer un talent en véritable savoir-faire professionnel.",
  inst_vision:
    "Devenir une référence dans la formation professionnelle aux métiers de la beauté et du bien-être.",
  inst_mission:
    "Transmettre des compétences pratiques et professionnelles permettant aux apprenants de développer leur savoir-faire.",
  inst_commitment:
    "Offrir un environnement d'apprentissage sérieux, structuré et orienté vers la pratique.",
  inst_pedagogy:
    "Une pédagogie fondée sur les démonstrations, les exercices pratiques, l'encadrement de proximité et l'acquisition progressive des compétences.",
  inst_img_history: px(7446683, 1000),
  inst_img_vision: px(36441633, 1000),
  inst_img_mission: px(10698008, 1000),
  inst_img_commitment: px(7446914, 1000),
  inst_img_pedagogy: px(7446917, 1000),
};

export type Settings = Record<string, string>;

export async function getSettings(): Promise<Settings> {
  const rows = await db.select().from(settings);
  const out: Settings = { ...SETTING_DEFAULTS };
  for (const r of rows) {
    if (r.key in SETTING_DEFAULTS && r.value !== "") out[r.key] = r.value;
  }
  return out;
}
