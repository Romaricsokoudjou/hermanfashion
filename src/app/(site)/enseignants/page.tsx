import type { Metadata } from "next";
import Link from "next/link";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { getTeachers } from "@/lib/queries";
import { initials } from "@/lib/images";
import { splitLines } from "@/lib/format";

export const metadata: Metadata = { title: "Nos enseignants" };

export default async function TeachersPage() {
  const teachers = await getTeachers();
  return (
    <>
      <PageHero
        eyebrow="Nos enseignants"
        title={
          <>
            Apprenez auprès de professionnels <span className="italic text-orange">passionnés.</span>
          </>
        }
        intro="Une équipe pédagogique engagée, qui transmet son expérience du métier par la démonstration et la pratique."
      />
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        {teachers.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="text-center">
                <div className="flex aspect-[3/4] items-center justify-center rounded-t-[999px] rounded-b-3xl bg-beige">
                  <span className="h-display text-7xl italic text-orange/40">?</span>
                </div>
                <p className="h-display mt-4 text-2xl text-mute">Profil à venir</p>
              </div>
            ))}
            <p className="col-span-full mt-4 text-center text-mute">Les portraits de nos enseignants seront présentés très prochainement.</p>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 90}>
                <article className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-beige">
                    {t.photo ? (
                      <Img src={t.photo} alt={t.name} w={800} className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="h-display text-8xl italic text-orange">{initials(t.name)}</span>
                      </div>
                    )}
                    {t.experience && (
                      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium shadow">{t.experience}</span>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <h2 className="h-display text-3xl">{t.name}</h2>
                    <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-orange">{t.specialty}</p>
                    {t.bio && <p className="mt-4 text-[15px] leading-relaxed text-mute">{t.bio}</p>}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {splitLines(t.skills).map((s) => (
                        <span key={s} className="rounded-full bg-beige px-3 py-1 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
      <section className="bg-ink py-20 text-center text-white">
        <h2 className="h-display text-4xl sm:text-5xl">Apprenez des meilleurs.</h2>
        <Link href="/inscription" className="btn btn-primary mt-8">
          S&apos;inscrire maintenant
        </Link>
      </section>
    </>
  );
}
