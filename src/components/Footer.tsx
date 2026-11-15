import Link from "next/link";
import Logo from "./Logo";
import type { Settings } from "@/lib/settings";

export default function Footer({ s, formations }: { s: Settings; formations: { slug: string; name: string }[] }) {
  const socials = [
    ["Facebook", s.facebook_url],
    ["Instagram", s.instagram_url],
    ["TikTok", s.tiktok_url],
    ["YouTube", s.youtube_url],
  ].filter(([, u]) => u);

  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              Institut de beauté et centre de formation professionnelle à Douala, Cameroun. Beauté, esthétique, coiffure, bien-être et
              formation aux techniques professionnelles.
            </p>
            <Link href="/inscription" className="btn btn-primary mt-8">
              S&apos;inscrire maintenant
            </Link>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-orange">Formations</h4>
            <ul className="space-y-2.5 text-sm">
              {formations.map((f) => (
                <li key={f.slug}>
                  <Link href={`/formations/${f.slug}`} className="transition hover:text-orange">
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-orange">Découvrir</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["/institution", "Notre institution"],
                ["/enseignants", "Nos enseignants"],
                ["/galerie", "Galerie"],
                ["/videotheque", "Vidéothèque"],
                ["/temoignages", "Témoignages"],
                ["/centres", "Nos centres"],
                ["/actualites", "Actualités"],
                ["/espace-candidat", "Espace candidat"],
                ["/contact", "Contact"],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="transition hover:text-orange">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-orange">Nous joindre</h4>
            <ul className="space-y-3 text-sm">
              <li>{s.contact_address}</li>
              {s.contact_phone && (
                <li>
                  <a href={`tel:${s.contact_phone.replace(/\s/g, "")}`} className="hover:text-orange">
                    {s.contact_phone}
                  </a>
                </li>
              )}
              {s.contact_email && (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="hover:text-orange">
                    {s.contact_email}
                  </a>
                </li>
              )}
              {s.opening_hours && <li className="whitespace-pre-line text-white/60">{s.opening_hours}</li>}
            </ul>
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map(([n, u]) => (
                  <a
                    key={n}
                    href={u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/20 px-4 py-1.5 text-xs transition hover:border-orange hover:text-orange"
                  >
                    {n}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} HERMAN FASHION — Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <p>Beauty • Aesthetics • Hairdressing • Wellness • Professional Training</p>
            <Link href="/admin" className="hover:text-orange">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
