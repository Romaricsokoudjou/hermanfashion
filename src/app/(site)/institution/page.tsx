import type { Metadata } from "next";
import Link from "next/link";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Notre institution" };

export default async function InstitutionPage() {
  const s = await getSettings();
  const sections = [
    { n: "01", t: "Notre histoire", text: s.inst_history, img: s.inst_img_history },
    { n: "02", t: "Notre vision", text: s.inst_vision, img: s.inst_img_vision },
    { n: "03", t: "Notre mission", text: s.inst_mission, img: s.inst_img_mission },
    { n: "04", t: "Notre engagement", text: s.inst_commitment, img: s.inst_img_commitment },
    { n: "05", t: "Notre pédagogie", text: s.inst_pedagogy, img: s.inst_img_pedagogy },
  ];

  return (
    <>
      <PageHero
        eyebrow="Notre institution"
        title={
          <>
            HERMAN FASHION, une vision de l&apos;excellence dans les <span className="italic text-orange">métiers de la beauté.</span>
          </>
        }
      />
      <div className="mx-auto max-w-7xl space-y-24 px-5 py-24 lg:space-y-36 lg:px-8 lg:py-32">
        {sections.map((sec, i) => (
          <section key={sec.n} className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal>
              <div className={`relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-beige ${i % 2 ? "rounded-b-[999px] rounded-t-3xl" : "rounded-t-[999px] rounded-b-3xl"}`}>
                <Img src={sec.img} alt={sec.t} w={900} className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <span className="h-display text-8xl italic text-orange/25">{sec.n}</span>
              <h2 className="h-display -mt-6 text-4xl sm:text-5xl lg:text-6xl">{sec.t}</h2>
              <div className="my-7 h-px w-20 bg-orange" />
              <p className="text-lg leading-relaxed text-mute">{sec.text}</p>
            </Reveal>
          </section>
        ))}
      </div>
      <section className="bg-ink py-20 text-center text-white">
        <Reveal>
          <h2 className="h-display text-4xl sm:text-5xl">Prêt à rejoindre l&apos;aventure ?</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/formations" className="btn btn-ghost !text-white">
              Nos formations
            </Link>
            <Link href="/inscription" className="btn btn-primary">
              S&apos;inscrire maintenant
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
