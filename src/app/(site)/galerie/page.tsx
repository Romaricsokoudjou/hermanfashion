import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";
import { getGallery } from "@/lib/queries";
import { GALLERY_CATEGORIES } from "@/lib/format";

export const metadata: Metadata = { title: "Galerie photographique" };

export default async function GalleryPage() {
  const items = await getGallery();
  const used = new Set(items.map((i) => i.category));
  const categories = [...GALLERY_CATEGORIES.filter((c) => used.has(c)), ...[...used].filter((c) => !GALLERY_CATEGORIES.includes(c))];
  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title={
          <>
            L&apos;univers HERMAN FASHION <span className="italic text-orange">en images.</span>
          </>
        }
        intro="Établissements, salles de formation, travaux pratiques et réalisations : parcourez nos catégories et agrandissez chaque photographie."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <GalleryGrid items={items.map((i) => ({ id: i.id, url: i.url, caption: i.caption, category: i.category }))} categories={categories} />
      </section>
    </>
  );
}
