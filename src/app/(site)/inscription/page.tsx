import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RegistrationForm from "@/components/RegistrationForm";
import { getFormations } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Inscription en ligne" };

export default async function RegistrationPage({ searchParams }: { searchParams: Promise<{ formation?: string }> }) {
  const [{ formation }, formations, s] = await Promise.all([searchParams, getFormations(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Inscription"
        title={
          <>
            Commencez votre <span className="italic text-orange">parcours.</span>
          </>
        }
        intro="Inscrivez-vous en ligne en trois étapes : choisissez votre formation, renseignez vos informations et validez."
      />
      <section className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(20,17,15,0.3)] sm:p-12">
          <RegistrationForm
            formations={formations.map((f) => ({ id: f.id, slug: f.slug, name: f.name, durations: f.durations }))}
            fee={parseInt(s.registration_fee) || 0}
            currency={s.currency}
            initialSlug={formation}
          />
        </div>
      </section>
    </>
  );
}
