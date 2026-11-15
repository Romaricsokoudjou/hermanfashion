import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import VideoEmbed from "@/components/VideoEmbed";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getTestimonials } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Témoignages" };

export default async function TestimonialsPage() {
  const [items, s] = await Promise.all([getTestimonials(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Témoignages"
        title={
          <>
            Ils nous ont fait confiance. <span className="italic text-orange">Découvrez leurs expériences.</span>
          </>
        }
      />
      <section className="mx-auto max-w-7xl overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        {items.length > 0 ? (
          <TestimonialsCarousel items={items} />
        ) : (
          <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-mute">
            Les témoignages de nos apprenants seront publiés ici, avec leur autorisation.
          </p>
        )}
      </section>
      <section className="bg-beige py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="eyebrow">Vidéo 3</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">Témoignages en images</h2>
          </Reveal>
          <Reveal className="mt-10" delay={100}>
            <VideoEmbed url={s.video3_url} title="Témoignages de nos apprenants" />
          </Reveal>
          <Link href="/inscription" className="btn btn-primary mt-12">
            S&apos;inscrire maintenant
          </Link>
        </div>
      </section>
    </>
  );
}
