import { db } from "@/db";
import { settings, formations, gallery, centers } from "@/db/schema";
import { px } from "./images";

const OBJECTIVES = [
  "Acquérir les gestes et les techniques de base de la discipline",
  "Progresser par les démonstrations et les exercices pratiques encadrés",
  "Développer son savoir-faire de manière progressive",
].join("\n");

const FORMATIONS: { slug: string; name: string; tagline: string; description: string; img: number }[] = [
  {
    slug: "coiffure-femme",
    name: "Coiffure femme",
    tagline: "L'art de sublimer la chevelure féminine",
    description:
      "Une formation pratique aux métiers de la coiffure féminine, pour apprendre à prendre soin des cheveux, les coiffer et accueillir une clientèle avec professionnalisme.",
    img: 36441633,
  },
  {
    slug: "coiffure-homme",
    name: "Coiffure homme",
    tagline: "Précision, style et savoir-faire du barbier",
    description:
      "Une formation dédiée à la coiffure masculine : coupe, finition et soin de la barbe, dans une démarche pratique et rigoureuse.",
    img: 7447148,
  },
  {
    slug: "onglerie-professionnelle",
    name: "Onglerie professionnelle",
    tagline: "La finesse au bout des doigts",
    description:
      "Apprenez les techniques de l'onglerie professionnelle et développez votre précision et votre sens du détail au contact d'encadrants expérimentés.",
    img: 7446914,
  },
  {
    slug: "esthetique-biologique",
    name: "Esthétique biologique",
    tagline: "Des soins du visage et du corps, dans le respect de la peau",
    description:
      "Une formation aux soins esthétiques fondée sur une approche biologique et respectueuse de la peau, avec une forte part de pratique.",
    img: 7446693,
  },
  {
    slug: "maquillage-professionnel",
    name: "Maquillage professionnel",
    tagline: "Révélez les regards, maîtrisez les teints",
    description:
      "Découvrez les techniques de maquillage professionnel et apprenez à mettre en valeur chaque visage avec exigence et créativité.",
    img: 4285538,
  },
  {
    slug: "massage-et-bien-etre",
    name: "Massage et bien-être",
    tagline: "Le geste qui apaise, la technique qui soigne",
    description:
      "Une formation aux techniques de massage et de bien-être, pour apprendre à procurer détente et confort dans un cadre professionnel.",
    img: 38407790,
  },
  {
    slug: "pedicure-et-manucure",
    name: "Pédicure et manucure",
    tagline: "Le soin des mains et des pieds, en toute expertise",
    description:
      "Apprenez les soins des mains et des pieds : une formation pratique pour acquérir les bons gestes et les règles d'hygiène du métier.",
    img: 31091766,
  },
  {
    slug: "extensions-de-cils",
    name: "Extensions de cils",
    tagline: "L'élégance du regard, pose après pose",
    description:
      "Une formation de précision à la pose d'extensions de cils, avec démonstrations et exercices pratiques encadrés.",
    img: 36930354,
  },
  {
    slug: "microblading-et-microshading",
    name: "Microblading et Microshading",
    tagline: "L'art du sourcil, avec méthode et rigueur",
    description:
      "Découvrez les techniques de microblading et de microshading au sein d'une formation structurée, axée sur la pratique et la rigueur.",
    img: 8826403,
  },
];

const GALLERY: [string, number, string][] = [
  ["Coiffure", 36441633, "Tressage en salon"],
  ["Coiffure", 36587243, "Mise en forme de la coiffure"],
  ["Coiffure", 7447148, "Coupe homme à la tondeuse"],
  ["Coiffure", 34384310, "Coiffure de cérémonie"],
  ["Onglerie", 7446914, "Soin des ongles"],
  ["Onglerie", 6135675, "Manucure de précision"],
  ["Onglerie", 361754, "Nail art"],
  ["Maquillage", 4285538, "Maquillage du regard"],
  ["Maquillage", 10698008, "Application professionnelle"],
  ["Maquillage", 7446917, "Maquillage en studio"],
  ["Soins esthétiques", 7446693, "Soin du visage"],
  ["Soins esthétiques", 7446675, "Soin relaxant"],
  ["Soins esthétiques", 7446683, "Traitement esthétique"],
  ["Massage", 38407790, "Massage du dos"],
  ["Massage", 9146381, "Massage des pieds"],
  ["Massage", 36436445, "Massage du visage"],
  ["Travaux pratiques", 36930354, "Pose de cils"],
  ["Travaux pratiques", 8826403, "Microblading"],
  ["Travaux pratiques", 31091766, "Pédicure"],
];

let started: Promise<void> | null = null;

export function ensureSeed() {
  if (!started) {
    started = run().catch((e) => {
      started = null;
      console.error("seed error", e);
    });
  }
  return started;
}

async function run() {
  const claimed = await db
    .insert(settings)
    .values({ key: "seeded", value: "1" })
    .onConflictDoNothing()
    .returning();
  if (claimed.length === 0) return;

  await db
    .insert(formations)
    .values(
      FORMATIONS.map((f, i) => ({
        slug: f.slug,
        name: f.name,
        tagline: f.tagline,
        description: f.description,
        objectives: OBJECTIVES,
        durations: "3,6,12",
        image: px(f.img, 1000),
        sortOrder: i + 1,
      })),
    )
    .onConflictDoNothing();

  await db.insert(gallery).values(
    GALLERY.map(([category, id, caption], i) => ({
      category,
      url: px(id, 900),
      caption,
      sortOrder: i + 1,
    })),
  );

  await db.insert(centers).values({
    name: "HERMAN FASHION — Douala",
    city: "Douala",
    address: "Douala, Cameroun",
    sortOrder: 1,
  });
}
