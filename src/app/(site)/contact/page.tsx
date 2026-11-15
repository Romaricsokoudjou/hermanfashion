import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSettings();
  const rows = [
    ["Adresse", s.contact_address],
    ["Téléphone", s.contact_phone],
    ["WhatsApp", s.contact_whatsapp],
    ["Email", s.contact_email],
    ["Horaires", s.opening_hours],
  ].filter(([, v]) => v);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons de <span className="italic text-orange">votre projet.</span>
          </>
        }
        intro="Une question sur nos formations, les durées ou l'inscription ? Écrivez-nous, notre équipe vous répond."
      />
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-28">
        <div className="space-y-8">
          {rows.map(([k, v]) => (
            <div key={k} className="border-b border-ink/10 pb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-orange">{k}</p>
              <p className="h-display mt-2 whitespace-pre-line text-3xl">{v}</p>
            </div>
          ))}
          {s.contact_whatsapp && (
            <a href={`https://wa.me/${s.contact_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              Écrire sur WhatsApp
            </a>
          )}
        </div>
        <div className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-sm sm:p-12">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
