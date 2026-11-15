"use client";

import { useEffect, useRef } from "react";
import Img from "./Img";
import { initials } from "@/lib/images";

type T = { id: number; name: string; location: string; formation: string; content: string; photo: string; videoUrl: string };

export default function TestimonialsCarousel({ items }: { items: T[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useRef(false);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 320) + 24;
    if (dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    if (items.length < 2) return;
    const iv = setInterval(() => {
      if (!hover.current) scroll(1);
    }, 6500);
    return () => clearInterval(iv);
  }, [items.length]);

  return (
    <div onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)}>
      <div ref={ref} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((t) => (
          <figure
            key={t.id}
            className="relative flex w-[86%] shrink-0 snap-start flex-col justify-between rounded-[2rem] border border-ink/8 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(20,17,15,0.35)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <span className="h-display absolute right-7 top-3 text-8xl leading-none text-orange/20">“</span>
            <blockquote className="relative text-[17px] leading-relaxed text-ink/85">{t.content}</blockquote>
            {t.videoUrl && (
              <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-orange">
                ▶ Voir le témoignage vidéo
              </a>
            )}
            <figcaption className="mt-8 flex items-center gap-4 border-t border-ink/10 pt-6">
              {t.photo ? (
                <Img src={t.photo} alt={t.name} w={160} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 font-medium text-orange">{initials(t.name)}</span>
              )}
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-mute">{[t.location, t.formation].filter(Boolean).join(" · ")}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-6 flex gap-3">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              onClick={() => scroll(d)}
              aria-label={d === 1 ? "Suivant" : "Précédent"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition hover:border-orange hover:bg-orange hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: d === -1 ? "scaleX(-1)" : undefined }}>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
