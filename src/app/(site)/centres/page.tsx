import type { Metadata } from "next";
import Img from "@/components/Img";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getCenters } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Nos centres" };

export default async function CentersPage() {
  const [centers, s] = await Promise.all([getCenters(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Nos centres"
        title={
          <>
            Rendez-nous visite, <span className="italic text-orange">à Douala.</span>
          </>
        }
        intro="Retrouvez nos adresses, nos horaires et nos coordonnées."
      />
      <section className="mx-auto max-w-7xl space-y-10 px-5 py-20 lg:px-8 lg:py-28">
        {centers.map((c) => (
          <Reveal key={c.id}>
            <article className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-sm lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <p className="eyebrow">{c.city || "Cameroun"}</p>
                <h2 className="h-display mt-4 text-4xl">{c.name}</h2>
                <dl className="mt-8 space-y-5 text-[15px]">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-mute">Adresse</dt>
                    <dd className="mt-1">{c.address || s.contact_address}</dd>
                  </div>
                  {(c.phone || s.contact_phone) && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-mute">Téléphone</dt>
                      <dd className="mt-1">{c.phone || s.contact_phone}</dd>
                    </div>
                  )}
                  {(c.email || s.contact_email) && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-mute">Email</dt>
                      <dd className="mt-1">{c.email || s.contact_email}</dd>
                    </div>
                  )}
                  {(c.hours || s.opening_hours) && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-mute">Horaires</dt>
                      <dd className="mt-1 whitespace-pre-line">{c.hours || s.opening_hours}</dd>
                    </div>
                  )}
                </dl>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address || c.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark mt-8"
                >
                  Voir sur la carte
                </a>
              </div>
              <div className="min-h-72 bg-beige">
                {c.mapUrl ? (
                  <iframe src={c.mapUrl} title={c.name} loading="lazy" className="h-full min-h-72 w-full border-0" />
                ) : c.image ? (
                  <Img src={c.image} alt={c.name} w={1000} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-72 items-center justify-center">
                    <span className="h-display text-8xl italic text-orange/30">{c.city || "HF"}</span>
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
