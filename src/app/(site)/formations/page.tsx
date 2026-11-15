import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import FormationCard from "@/components/FormationCard";
import VideoEmbed from "@/components/VideoEmbed";
import { getFormations } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Nos formations professionnelles" };

export default async function FormationsPage() {
  const [formations, s] = await Promise.all([getFormations(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Nos formations"
        title={
          <>
            Des métiers de la beauté, <span className="italic text-orange">appris par la pratique.</span>
          </>
        }
        intro="Neuf spécialités pour acquérir un savoir-faire professionnel, en 3 mois, 6 mois ou 1 an."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formations.map((f, i) => (
            <Reveal key={f.id} delay={(i % 3) * 90}>
              <FormationCard f={f} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-beige py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-3 lg:px-8">
          {[
            ["3", "mois", "Initiation intensive aux fondamentaux"],
            ["6", "mois", "Approfondissement des techniques"],
            ["1", "an", "Parcours complet et progressif"],
          ].map(([n, u, d]) => (
            <Reveal key={n}>
              <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <p className="h-display text-7xl text-orange">{n}</p>
                <p className="text-sm font-medium uppercase tracking-[0.3em]">{u}</p>
                <p className="mt-3 text-sm text-mute">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl px-5 text-center text-sm text-mute">
          Les contenus détaillés, les tarifs et les conditions d&apos;accès sont communiqués par l&apos;équipe pédagogique.{" "}
          <Link href="/contact" className="text-orange underline">
            Nous contacter
          </Link>
        </p>
      </section>

      <section className="bg-ink py-24 text-white">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="eyebrow">Vidéo 2</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">
              Immersion dans nos <span className="italic text-orange">formations</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">Démonstrations professionnelles, cours pratiques, enseignants au travail et apprenants en situation réelle.</p>
          </Reveal>
          <Reveal className="mt-10" delay={100}>
            <VideoEmbed url={s.video2_url} title="Immersion dans nos formations" dark />
          </Reveal>
        </div>
      </section>
    </>
  );
}
