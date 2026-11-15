import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import VideoEmbed from "@/components/VideoEmbed";
import { getFormation, getFormations } from "@/lib/queries";
import { durationLabel, parseDurations, splitLines } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = await getFormation(slug);
  return { title: f?.name ?? "Formation", description: f?.description };
}

function Pending() {
  return <p className="rounded-2xl border border-dashed border-ink/20 p-6 text-sm text-mute">Contenu détaillé communiqué par l&apos;équipe pédagogique. N&apos;hésitez pas à nous contacter.</p>;
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  const f = await getFormation(slug);
  if (!f) notFound();
  const all = await getFormations();
  const others = all.filter((x) => x.id !== f.id).slice(0, 3);

  const objectives = splitLines(f.objectives);
  const skills = splitLines(f.skills);
  const program = splitLines(f.program);
  const careers = splitLines(f.careers);
  const photos = splitLines(f.gallery);
  const durations = parseDurations(f.durations);

  return (
    <>
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink text-white">
        <Img src={f.image} alt={f.name} w={1800} priority className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 lg:px-8">
          <Link href="/formations" className="text-xs uppercase tracking-[0.25em] text-white/70 hover:text-orange">
            ← Toutes les formations
          </Link>
          <h1 className="h-display animate-fadeup mt-5 text-5xl sm:text-6xl lg:text-8xl">{f.name}</h1>
          <p className="animate-fadeup mt-4 max-w-2xl text-lg text-white/80" style={{ animationDelay: "150ms" }}>
            {f.tagline}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1fr_340px] lg:px-8 lg:py-28">
        <div className="space-y-20">
          <Reveal>
            <p className="eyebrow">Présentation</p>
            <p className="h-display mt-5 text-3xl leading-snug sm:text-4xl">{f.description}</p>
          </Reveal>

          <Reveal>
            <h2 className="h-display text-4xl">Objectifs pédagogiques</h2>
            <div className="mt-6">
              {objectives.length ? (
                <ul className="space-y-4">
                  {objectives.map((o) => (
                    <li key={o} className="flex gap-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="m3 8.5 3.2 3.2L13 4.8" />
                        </svg>
                      </span>
                      <span className="text-lg text-ink/80">{o}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Pending />
              )}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="h-display text-4xl">Compétences à acquérir</h2>
            <div className="mt-6">
              {skills.length ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((x) => (
                    <span key={x} className="rounded-full bg-beige px-5 py-2.5 text-sm">
                      {x}
                    </span>
                  ))}
                </div>
              ) : (
                <Pending />
              )}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="h-display text-4xl">Programme</h2>
            <div className="mt-6">
              {program.length ? (
                <ol className="relative space-y-6 border-l border-orange/40 pl-8">
                  {program.map((p, i) => (
                    <li key={p} className="relative">
                      <span className="absolute -left-[2.9rem] flex h-8 w-8 items-center justify-center rounded-full bg-orange text-xs font-semibold text-white">{i + 1}</span>
                      <p className="text-lg text-ink/80">{p}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <Pending />
              )}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="h-display text-4xl">Débouchés professionnels</h2>
            <div className="mt-6">
              {careers.length ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {careers.map((c) => (
                    <li key={c} className="rounded-2xl border border-ink/10 p-5">
                      {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <Pending />
              )}
            </div>
          </Reveal>

          {photos.length > 0 && (
            <Reveal>
              <h2 className="h-display text-4xl">Photographies</h2>
              <div className="mt-6 columns-2 gap-4 [&>*]:mb-4">
                {photos.map((p) => (
                  <Img key={p} src={p} alt={f.name} w={800} className="w-full break-inside-avoid rounded-2xl" />
                ))}
              </div>
            </Reveal>
          )}

          {f.videoUrl && (
            <Reveal>
              <h2 className="h-display mb-6 text-4xl">Vidéo</h2>
              <VideoEmbed url={f.videoUrl} title={f.name} />
            </Reveal>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] bg-ink p-8 text-white shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-orange">Durées disponibles</p>
            <ul className="mt-5 space-y-3">
              {durations.map((d) => (
                <li key={d} className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="h-display text-3xl">{durationLabel(d)}</span>
                  <span className="h-2 w-2 rounded-full bg-orange" />
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-white/50">Tarifs et conditions communiqués par l&apos;équipe.</p>
            <Link href={`/inscription?formation=${f.slug}`} className="btn btn-primary mt-8 w-full">
              S&apos;inscrire à cette formation
            </Link>
            <Link href="/contact" className="btn btn-ghost mt-3 w-full !text-white">
              Poser une question
            </Link>
          </div>
        </aside>
      </div>

      <section className="bg-beige py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="h-display text-4xl">Découvrez aussi</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} href={`/formations/${o.slug}`} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-xl">
                <div className="aspect-[16/10] overflow-hidden">
                  <Img src={o.image} alt={o.name} w={600} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <p className="h-display p-5 text-2xl group-hover:text-orange">{o.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
