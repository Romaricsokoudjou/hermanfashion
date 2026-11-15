import { GALLERY_CATEGORIES, PAY_STATUS, REG_STATUS, durationLabel, formatDate } from "@/lib/format";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "date";
export type Field = {
  key: string;
  label: string;
  type?: FieldType;
  options?: [string, string][];
  readOnly?: boolean;
  hint?: string;
};
export type Column = { key: string; label: string; kind?: "image" | "bool" | "date" | "text"; render?: (r: Row) => string };
export type Row = Record<string, string | number | boolean | null>;
export type Resource = {
  key: string;
  label: string;
  singular: string;
  fields: Field[];
  columns: Column[];
  canCreate?: boolean;
  csv?: boolean;
};

const opts = (o: Record<string, string>): [string, string][] => Object.entries(o);

export const RESOURCES: Resource[] = [
  {
    key: "registrations",
    label: "Inscriptions",
    singular: "inscription",
    canCreate: false,
    csv: true,
    columns: [
      { key: "reference", label: "Référence" },
      { key: "createdAt", label: "Date", kind: "date" },
      { key: "name", label: "Candidat", render: (r) => `${r.firstName} ${r.lastName}` },
      { key: "formationName", label: "Formation", render: (r) => `${r.formationName} · ${durationLabel(String(r.duration))}` },
      { key: "status", label: "Statut", render: (r) => REG_STATUS[String(r.status)] ?? String(r.status) },
      { key: "paymentStatus", label: "Paiement", render: (r) => PAY_STATUS[String(r.paymentStatus)] ?? String(r.paymentStatus) },
    ],
    fields: [
      { key: "status", label: "Statut du dossier", type: "select", options: opts(REG_STATUS) },
      { key: "paymentStatus", label: "Statut du paiement", type: "select", options: opts(PAY_STATUS) },
      { key: "reference", label: "Référence", readOnly: true },
      { key: "firstName", label: "Prénom", readOnly: true },
      { key: "lastName", label: "Nom", readOnly: true },
      { key: "email", label: "Email", readOnly: true },
      { key: "phone", label: "Téléphone", readOnly: true },
      { key: "city", label: "Ville", readOnly: true },
      { key: "country", label: "Pays", readOnly: true },
      { key: "birthDate", label: "Naissance", readOnly: true },
      { key: "level", label: "Niveau d'études", readOnly: true },
      { key: "formationName", label: "Formation", readOnly: true },
      { key: "duration", label: "Durée (mois)", readOnly: true },
      { key: "paymentMethod", label: "Mode de paiement", readOnly: true },
      { key: "amount", label: "Montant", readOnly: true },
      { key: "message", label: "Message", readOnly: true },
    ],
  },
  {
    key: "formations",
    label: "Formations",
    singular: "formation",
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "name", label: "Nom" },
      { key: "durations", label: "Durées", render: (r) => String(r.durations).split(",").map(durationLabel).join(" / ") },
      { key: "sortOrder", label: "Ordre" },
      { key: "active", label: "Active", kind: "bool" },
    ],
    fields: [
      { key: "name", label: "Nom de la formation" },
      { key: "slug", label: "Adresse (slug)", hint: "Laisser vide pour générer automatiquement" },
      { key: "tagline", label: "Accroche" },
      { key: "description", label: "Présentation", type: "textarea" },
      { key: "objectives", label: "Objectifs pédagogiques", type: "textarea", hint: "Un élément par ligne" },
      { key: "skills", label: "Compétences à acquérir", type: "textarea", hint: "Un élément par ligne" },
      { key: "program", label: "Programme", type: "textarea", hint: "Une étape par ligne" },
      { key: "careers", label: "Débouchés professionnels", type: "textarea", hint: "Un élément par ligne" },
      { key: "durations", label: "Durées proposées", hint: "Codes séparés par des virgules : 3 (3 mois), 6 (6 mois), 12 (1 an)" },
      { key: "image", label: "Photo principale (URL)" },
      { key: "gallery", label: "Autres photos (URLs)", type: "textarea", hint: "Une URL par ligne" },
      { key: "videoUrl", label: "Vidéo (YouTube, Vimeo ou fichier .mp4)" },
      { key: "sortOrder", label: "Ordre d'affichage", type: "number" },
      { key: "active", label: "Formation active (visible sur le site)", type: "checkbox" },
    ],
  },
  {
    key: "teachers",
    label: "Enseignants",
    singular: "enseignant",
    columns: [
      { key: "photo", label: "", kind: "image" },
      { key: "name", label: "Nom" },
      { key: "specialty", label: "Spécialité" },
      { key: "active", label: "Visible", kind: "bool" },
    ],
    fields: [
      { key: "name", label: "Nom et prénom" },
      { key: "specialty", label: "Spécialité" },
      { key: "experience", label: "Expérience professionnelle", hint: "Ex. : intitulé court affiché sur la photo" },
      { key: "bio", label: "Présentation", type: "textarea" },
      { key: "skills", label: "Compétences", type: "textarea", hint: "Une compétence par ligne" },
      { key: "photo", label: "Photo (URL)" },
      { key: "sortOrder", label: "Ordre d'affichage", type: "number" },
      { key: "active", label: "Visible sur le site", type: "checkbox" },
    ],
  },
  {
    key: "gallery",
    label: "Galerie",
    singular: "photographie",
    columns: [
      { key: "url", label: "", kind: "image" },
      { key: "caption", label: "Légende" },
      { key: "category", label: "Catégorie" },
      { key: "sortOrder", label: "Ordre" },
    ],
    fields: [
      { key: "url", label: "Photographie (URL)" },
      { key: "caption", label: "Légende" },
      { key: "category", label: "Catégorie", type: "select", options: GALLERY_CATEGORIES.map((c): [string, string] => [c, c]) },
      { key: "sortOrder", label: "Ordre de classement", type: "number" },
    ],
  },
  {
    key: "testimonials",
    label: "Témoignages",
    singular: "témoignage",
    columns: [
      { key: "photo", label: "", kind: "image" },
      { key: "name", label: "Nom" },
      { key: "formation", label: "Formation" },
      { key: "approved", label: "Publié", kind: "bool" },
    ],
    fields: [
      { key: "name", label: "Nom" },
      { key: "location", label: "Ville ou pays" },
      { key: "formation", label: "Formation suivie" },
      { key: "content", label: "Témoignage", type: "textarea" },
      { key: "photo", label: "Photo (URL)" },
      { key: "videoUrl", label: "Vidéo (facultatif)" },
      { key: "approved", label: "Publié (autorisation de l'apprenant obtenue)", type: "checkbox" },
    ],
  },
  {
    key: "centers",
    label: "Centres",
    singular: "centre",
    columns: [
      { key: "name", label: "Nom" },
      { key: "city", label: "Ville" },
      { key: "address", label: "Adresse" },
    ],
    fields: [
      { key: "name", label: "Nom du centre" },
      { key: "city", label: "Ville" },
      { key: "address", label: "Adresse" },
      { key: "phone", label: "Téléphone" },
      { key: "email", label: "Email" },
      { key: "hours", label: "Horaires", type: "textarea" },
      { key: "mapUrl", label: "Lien d'intégration Google Maps (embed)" },
      { key: "image", label: "Photo (URL)" },
      { key: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  {
    key: "news",
    label: "Actualités",
    singular: "actualité",
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "title", label: "Titre" },
      { key: "publishedAt", label: "Date", kind: "date" },
      { key: "active", label: "Publié", kind: "bool" },
    ],
    fields: [
      { key: "title", label: "Titre" },
      { key: "slug", label: "Adresse (slug)", hint: "Laisser vide pour générer automatiquement" },
      { key: "excerpt", label: "Résumé", type: "textarea" },
      { key: "content", label: "Contenu", type: "textarea" },
      { key: "image", label: "Image (URL)" },
      { key: "publishedAt", label: "Date de publication", type: "date" },
      { key: "active", label: "Publié", type: "checkbox" },
    ],
  },
  {
    key: "messages",
    label: "Messages",
    singular: "message",
    canCreate: false,
    columns: [
      { key: "createdAt", label: "Date", kind: "date" },
      { key: "name", label: "Nom" },
      { key: "subject", label: "Sujet" },
      { key: "read", label: "Lu", kind: "bool" },
    ],
    fields: [
      { key: "read", label: "Marqué comme lu", type: "checkbox" },
      { key: "name", label: "Nom", readOnly: true },
      { key: "email", label: "Email", readOnly: true },
      { key: "phone", label: "Téléphone", readOnly: true },
      { key: "subject", label: "Sujet", readOnly: true },
      { key: "message", label: "Message", readOnly: true },
    ],
  },
];

export const SETTINGS_GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Indicateurs institutionnels",
    fields: [
      { key: "stat_learners", label: "Apprenants formés", hint: "Ex. : 500+. Laisser vide pour masquer l'indicateur." },
      { key: "stat_specialties", label: "Spécialités", hint: "Vide = nombre de formations actives" },
      { key: "stat_teachers", label: "Enseignants" },
      { key: "stat_years", label: "Années d'expérience" },
    ],
  },
  {
    title: "Vidéos stratégiques (YouTube, Vimeo ou .mp4)",
    fields: [
      { key: "video1_url", label: "Vidéo 1 — Découvrir HERMAN FASHION" },
      { key: "video2_url", label: "Vidéo 2 — Immersion dans nos formations" },
      { key: "video3_url", label: "Vidéo 3 — Témoignages" },
    ],
  },
  {
    title: "Inscription et paiement",
    fields: [
      { key: "registration_fee", label: "Frais d'inscription (montant)", hint: "Laisser vide si aucun paiement en ligne n'est requis" },
      { key: "currency", label: "Devise", hint: "XAF" },
      { key: "notifications_enabled", label: "Notifications d'inscription (1 = actives, 0 = désactivées)" },
    ],
  },
  {
    title: "Images de la page d'accueil",
    fields: [
      { key: "hero_image", label: "Photographie de la bannière principale (URL)", hint: "Remplacez par une photo officielle de l'établissement" },
      { key: "intro_image", label: "Photographie de la présentation (URL)" },
    ],
  },
  {
    title: "Page Institution",
    fields: [
      { key: "inst_history", label: "Notre histoire", type: "textarea" },
      { key: "inst_img_history", label: "Photo — histoire (URL)" },
      { key: "inst_vision", label: "Notre vision", type: "textarea" },
      { key: "inst_img_vision", label: "Photo — vision (URL)" },
      { key: "inst_mission", label: "Notre mission", type: "textarea" },
      { key: "inst_img_mission", label: "Photo — mission (URL)" },
      { key: "inst_commitment", label: "Notre engagement", type: "textarea" },
      { key: "inst_img_commitment", label: "Photo — engagement (URL)" },
      { key: "inst_pedagogy", label: "Notre pédagogie", type: "textarea" },
      { key: "inst_img_pedagogy", label: "Photo — pédagogie (URL)" },
    ],
  },
  {
    title: "Coordonnées et réseaux sociaux",
    fields: [
      { key: "contact_address", label: "Adresse" },
      { key: "contact_phone", label: "Téléphone" },
      { key: "contact_whatsapp", label: "WhatsApp (avec indicatif)" },
      { key: "contact_email", label: "Email" },
      { key: "opening_hours", label: "Horaires d'ouverture", type: "textarea" },
      { key: "facebook_url", label: "Facebook" },
      { key: "instagram_url", label: "Instagram" },
      { key: "tiktok_url", label: "TikTok" },
      { key: "youtube_url", label: "YouTube" },
    ],
  },
];

export { formatDate };
