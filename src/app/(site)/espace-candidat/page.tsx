import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CandidateSpace from "@/components/CandidateSpace";

export const metadata: Metadata = { title: "Espace candidat" };

export default function CandidatePage() {
  return (
    <>
      <PageHero
        eyebrow="Espace candidat"
        title={
          <>
            Suivez votre <span className="italic text-orange">dossier.</span>
          </>
        }
        intro="Retrouvez l'état de votre inscription et de votre paiement avec votre référence."
      />
      <section className="mx-auto max-w-2xl px-5 py-16 lg:py-24">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(20,17,15,0.3)] sm:p-12">
          <CandidateSpace />
        </div>
      </section>
    </>
  );
}
