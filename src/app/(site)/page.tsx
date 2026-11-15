import Link from "next/link";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import VideoEmbed from "@/components/VideoEmbed";
import FormationCard from "@/components/FormationCard";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getSettings } from "@/lib/settings";
import { getFormations, getTeachers, getTestimonials } from "@/lib/queries";
import { initials } from "@/lib/images";

const PILLARS = [
  ["L'apprentissage pratique", "Des démonstrations et des exercices en situation réelle pour acquérir les bons gestes."],
  ["L'encadrement professionnel", "Un suivi par des formateurs qui transmettent leur savoir-faire du métier."],
  ["La diversité des spécialités", "Coiffure, esthétique, onglerie, maquillage, massage, cils et microblading."],
  ["L'accompagnement des apprenants", "Une progression structurée, de la découverte à l'autonomie professionnelle."],
  ["Des durées adaptées", "Trois formats de formation : 3 mois, 6 mois ou 1 an."],
];

export default async function HomePage() {
  const [s, formations, teachers, testimonials] = await Promise.all([getSettings(), getFormations(), getTeachers(), getTestimonials()]);

  const stats = [
    { value: s.stat_learners, label: "Apprenants formés" },
    { value: s.stat_specialties || String(formations.length), label: "Spécialités" },
    { value: s.stat_teachers, label: "Enseignants" },
    { value: s.stat_years, label: "Années d'expérience" },
  ].filter((x) => x.value);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-white">
        <Img src={s.hero_image} alt="Soin de beauté professionnel — HERMAN FASHION" w={1800} priority className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />

        <div className="relative mx-auto grid w-full max-w-7xl items-end gap-10 px-5 pb-16 pt-40 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:pb-24">
          <div>
            <p className="eyebrow animate-fadeup !text-orange">Institut de beauté · Centre de formation · Douala</p>
            <h1 className="h-display animate-fadeup mt-6 text-[2.9rem] sm:text-6xl lg:text-[5.4rem]" style={{ animationDelay: "150ms" }}>
              Révélez votre talent. <span className="italic text-orange">Maîtrisez</span> les métiers de la beauté.
            </h1>
            <p className="animate-fadeup mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg" style={{ animationDelay: "300ms" }}>
              Bienvenue chez HERMAN FASHION, votre centre de formation professionnelle dédié à l&apos;excellence dans la beauté, l&apos;esthétique, la
              coiffure et le bien-être.
            </p>
            <div className="animate-fadeup mt-10 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "450ms" }}>
              <Link href="/formations" className="btn btn-ghost !text-white">
                Découvrir nos formations
              </Link>
              <Link href="/inscription" className="btn btn-primary animate-ring">
                Commencer mon inscription
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative hidden justify-self-end lg:block">
            <div className="animate-spin-slow flex h-44 w-44 items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text fill="white" fontSize="14" letterSpacing="5" fontFamily="var(--font-jost)">
                  <textPath href="#circ">BEAUTÉ • ESTHÉTIQUE • COIFFURE • BIEN-ÊTRE •</textPath>
                </text>
              </svg>
            </div>
            <span className="h-display absolute inset-0 flex items-center justify-center text-6xl italic text-orange">H</span>
          </div>
        </div>
      </section>

      {/* BANDEAU SPÉCIALITÉS */}
      <div className="overflow-hidden bg-orange py-4 text-white">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.3em]">
          {[...formations, ...formations, ...formations].map((f, i) => (
            <span key={i} className="flex items-center gap-10">
              {f.name}
              <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* PRÉSENTATION */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-beige">
            <Img src={s.intro_image} alt="Soin esthétique en formation" w={900} className="h-full w-full object-cover" />
          </div>
          <div className="animate-floaty absolute -bottom-6 -right-4 rounded-2xl bg-white p-5 shadow-2xl sm:-right-10">
            <p className="h-display text-4xl italic text-orange">9</p>
            <p className="text-xs uppercase tracking-widest text-mute">spécialités à explorer</p>
          </div>
          <div className="absolute -left-6 top-10 -z-10 h-full w-full rounded-t-[999px] border border-orange/40" />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">Notre approche</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
              L&apos;excellence au service de <span className="italic text-orange">votre passion.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-mute">
              HERMAN FASHION accompagne les personnes qui souhaitent acquérir des compétences professionnelles dans les métiers de la beauté, avec
              une pédagogie résolument tournée vers la pratique.
            </p>
          </Reveal>
          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {PILLARS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 70}>
                <li className="group flex gap-5 py-5">
                  <span className="h-display text-2xl italic text-orange">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold transition group-hover:text-orange">{t}</h3>
                    <p className="mt-1 text-sm text-mute">{d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
          <Link href="/institution" className="btn btn-outline mt-10">
            Découvrir l&apos;institution
          </Link>
        </div>
      </section>

      {/* INDICATEURS */}
      {stats.length > 0 && (
        <section className="bg-ink py-16 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-6 gap-y-10 px-5 text-center lg:px-8">
            {stats.map((st) => (
              <div key={st.label} className="w-[45%] lg:w-[22%]">
                <p className="h-display text-6xl text-orange sm:text-7xl">
                  <CountUp value={st.value} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">{st.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIDÉO 1 */}
      <section className="bg-beige py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="eyebrow">Vidéo 1</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">
              Découvrir <span className="italic text-orange">HERMAN FASHION</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-mute">Présentation générale, visite des locaux, rencontre avec nos équipes et immersion dans notre environnement de formation.</p>
          </Reveal>
          <Reveal className="mt-12" delay={100}>
            <VideoEmbed url={s.video1_url} title="Découvrir HERMAN FASHION" />
          </Reveal>
        </div>
      </section>

      {/* FORMATIONS */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Nos formations professionnelles</p>
            <h2 className="h-display mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
              Choisissez le métier qui <span className="italic text-orange">vous ressemble.</span>
            </h2>
          </div>
          <Link href="/formations" className="btn btn-outline self-start lg:self-auto">
            Toutes les formations
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formations.map((f, i) => (
            <Reveal key={f.id} delay={(i % 3) * 90}>
              <FormationCard f={f} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* VIDÉO 2 */}
      <section className="bg-ink py-24 text-white lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">Vidéo 2</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">
              Immersion dans nos <span className="italic text-orange">formations</span>
            </h2>
            <p className="mt-5 leading-relaxed text-white/65">Démonstrations professionnelles, cours pratiques, enseignants au travail et apprenants en situation réelle.</p>
            <Link href="/formations" className="btn btn-primary mt-8">
              Explorer les formations
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <VideoEmbed url={s.video2_url} title="Immersion dans nos formations" dark />
          </Reveal>
        </div>
      </section>

      {/* ENSEIGNANTS */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <Reveal className="text-center">
          <p className="eyebrow">Nos enseignants</p>
          <h2 className="h-display mx-auto mt-5 max-w-3xl text-4xl sm:text-5xl">
            Apprenez auprès de professionnels <span className="italic text-orange">passionnés.</span>
          </h2>
        </Reveal>
        {teachers.length > 0 && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teachers.slice(0, 4).map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <Link href="/enseignants" className="group block">
                  <div className="aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-beige">
                    {t.photo ? (
                      <Img src={t.photo} alt={t.name} w={600} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="h-display text-6xl italic text-orange">{initials(t.name)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="h-display mt-4 text-2xl">{t.name}</h3>
                  <p className="text-sm text-orange">{t.specialty}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/enseignants" className="btn btn-outline">
            Rencontrer l&apos;équipe pédagogique
          </Link>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="overflow-hidden bg-beige py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="eyebrow">Témoignages</p>
            <h2 className="h-display mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
              Ils nous ont fait confiance. <span className="italic text-orange">Découvrez leurs expériences.</span>
            </h2>
          </Reveal>
          <div className="mt-12">
            {testimonials.length > 0 ? (
              <TestimonialsCarousel items={testimonials} />
            ) : (
              <p className="max-w-xl rounded-2xl border border-dashed border-ink/20 p-8 text-mute">
                Les témoignages de nos apprenants seront publiés ici, avec leur autorisation.
              </p>
            )}
          </div>

          {/* VIDÉO 3 */}
          <div className="mx-auto mt-24 max-w-4xl text-center">
            <Reveal>
              <p className="eyebrow">Vidéo 3</p>
              <h3 className="h-display mt-4 text-3xl sm:text-4xl">Témoignages en images</h3>
              <p className="mx-auto mt-4 max-w-xl text-mute">Expériences personnelles, réalisations et parcours de formation racontés par nos apprenants.</p>
            </Reveal>
            <Reveal className="mt-10" delay={100}>
              <VideoEmbed url={s.video3_url} title="Témoignages de nos apprenants" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* INSCRIPTION */}
      <section className="relative overflow-hidden bg-orange py-24 text-white lg:py-32">
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full border border-white/25" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-[30rem] w-[30rem] rounded-full border border-white/25" />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/80">Inscriptions ouvertes</p>
            <h2 className="h-display mt-5 text-5xl sm:text-6xl lg:text-7xl">Votre avenir dans la beauté commence ici.</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">Choisissez votre formation, votre durée (3 mois, 6 mois ou 1 an) et inscrivez-vous en ligne en quelques minutes.</p>
            <Link href="/inscription" className="btn mt-10 bg-ink text-white hover:bg-white hover:text-ink">
              S&apos;inscrire maintenant
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
