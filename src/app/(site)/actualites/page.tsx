import type { Metadata } from "next";
import Link from "next/link";
import Img from "@/components/Img";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getNews } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Actualités" };

export default async function NewsPage() {
  const items = await getNews();
  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title={
          <>
            La vie de <span className="italic text-orange">l&apos;institut.</span>
          </>
        }
        intro="Annonces, événements et nouvelles de HERMAN FASHION."
      />
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-mute">Nos prochaines actualités seront publiées ici.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n, i) => (
              <Reveal key={n.id} delay={(i % 3) * 90}>
                <Link href={`/actualites/${n.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-beige">
                    {n.image && <Img src={n.image} alt={n.title} w={800} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.2em] text-orange">{formatDate(n.publishedAt)}</p>
                  <h2 className="h-display mt-2 text-3xl group-hover:text-orange">{n.title}</h2>
                  <p className="mt-2 text-mute">{n.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
