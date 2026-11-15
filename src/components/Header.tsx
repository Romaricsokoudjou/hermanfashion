"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const PRIMARY = [
  { href: "/institution", label: "Institution" },
  { href: "/formations", label: "Formations" },
  { href: "/enseignants", label: "Enseignants" },
  { href: "/galerie", label: "Galerie" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];
const MORE = [
  { href: "/videotheque", label: "Vidéothèque" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/centres", label: "Nos centres" },
  { href: "/espace-candidat", label: "Espace candidat" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 400);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const transparent = pathname === "/" && !scrolled && !open;
  const textColor = transparent ? "text-white" : "text-ink";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open ? "-translate-y-full" : "translate-y-0"} ${
          transparent ? "bg-transparent py-5" : "bg-white/90 py-3 shadow-[0_1px_0_rgba(20,17,15,0.06)] backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
          <Link href="/" aria-label="HERMAN FASHION — accueil" onClick={() => setOpen(false)}>
            <Logo light={transparent} />
          </Link>

          <nav className={`hidden items-center gap-7 text-[13px] font-medium tracking-wide xl:flex ${textColor}`}>
            {PRIMARY.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 transition hover:text-orange ${pathname.startsWith(l.href) ? "text-orange" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="group relative">
              <button className="flex items-center gap-1 py-1 transition hover:text-orange">
                Plus
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 3.5 5 6.5 8 3.5" />
                </svg>
              </button>
              <div className="invisible absolute right-0 top-full w-52 translate-y-2 pt-3 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-2xl border border-ink/5 bg-white p-2 text-ink shadow-xl">
                  {MORE.map((l) => (
                    <Link key={l.href} href={l.href} className="block rounded-xl px-4 py-2.5 text-sm transition hover:bg-beige hover:text-orange">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/inscription" className="btn btn-primary hidden !px-5 !py-3 !text-[12px] sm:inline-flex">
              S&apos;inscrire maintenant
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full border xl:hidden ${
                transparent ? "border-white/40 text-white" : "border-ink/15 text-ink"
              }`}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-px w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-px w-5 bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-ink px-6 pb-10 pt-28 text-white transition-all duration-500 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-md flex-col justify-between overflow-y-auto">
          <div className="flex flex-col">
            {[{ href: "/", label: "Accueil" }, ...PRIMARY, ...MORE].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="h-display flex items-baseline gap-4 border-b border-white/10 py-3 text-3xl transition hover:text-orange"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <span className="text-xs tracking-widest text-orange">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/inscription" onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
            S&apos;inscrire maintenant
          </Link>
        </div>
      </div>
    </>
  );
}
