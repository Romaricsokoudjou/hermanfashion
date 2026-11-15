import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import VideoEmbed from "@/components/VideoEmbed";
import { getSettings } from "@/lib/settings";
import { getFormations } from "@/lib/queries";

export const metadata: Metadata = { title: "Vidéothèque" };

export default async function VideoLibraryPage() {
  const [s, formations] = await Promise.all([getSettings(), getFormations()]);
  const main = [
    { n: "1", t: "Découvrir HERMAN FASHION", d: "Présentation générale, visite des locaux, présentation des équipes et environnement de formation.", u: s.video1_url },
    { n: "2", t: "Immersion dans nos formations", d: "Démonstrations professionnelles, cours pratiques, enseignants au travail, apprenants en situation réelle.", u: s.video2_url },
    { n: "3", t: "Témoignages", d: "Témoignages d'apprenants, expériences personnelles, réalisations et parcours de formation.", u: s.video3_url },
  ];
  const extra = formations.filter((f) => f.videoUrl);
  return (
    <>
      <PageHero
        eyebrow="Vidéothèque"
        title={
          <>
            Voir pour <span className="italic text-orange">mieux comprendre.</span>
          </>
        }
        intro="Plongez dans l'univers de l'institut : découverte des lieux, démonstrations et paroles d'apprenants."
      />
      <section className="mx-auto max-w-6xl space-y-24 px-5 py-20 lg:px-8 lg:py-28">
        {main.map((v) => (
          <Reveal key={v.n}>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.5fr]">
              <div>
                <span className="h-display text-7xl italic text-orange/30">0{v.n}</span>
                <h2 className="h-display -mt-3 text-4xl">{v.t}</h2>
                <p className="mt-4 text-mute">{v.d}</p>
              </div>
              <VideoEmbed url={v.u} title={v.t} />
            </div>
          </Reveal>
        ))}
        {extra.length > 0 && (
          <div>
            <h2 className="h-display text-4xl">Vidéos par formation</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {extra.map((f) => (
                <div key={f.id}>
                  <VideoEmbed url={f.videoUrl} title={f.name} poster={f.image} />
                  <p className="h-display mt-3 text-2xl">{f.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
