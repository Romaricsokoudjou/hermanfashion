"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { resize } from "@/lib/images";

type Item = { id: number; url: string; caption: string; category: string };

export default function GalleryGrid({ items, categories }: { items: Item[]; categories: string[] }) {
  const [cat, setCat] = useState("Tout");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(() => (cat === "Tout" ? items : items.filter((i) => i.category === cat)), [items, cat]);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  const cur = open !== null ? shown[open] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {["Tout", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              setOpen(null);
            }}
            className={`rounded-full border px-5 py-2 text-[13px] transition ${
              cat === c ? "border-orange bg-orange text-white" : "border-ink/15 hover:border-orange hover:text-orange"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-mute">Aucune photographie dans cette catégorie pour le moment.</p>
      ) : (
        <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {shown.map((it, i) => (
            <button
              key={it.id}
              onClick={() => setOpen(i)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-beige text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resize(it.url, 700)}
                alt={it.caption || it.category}
                loading="lazy"
                decoding="async"
                className="w-full transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="text-sm text-white">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-orange">{it.category}</span>
                  {it.caption}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {cur && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur" onClick={close} role="dialog" aria-modal="true">
          <button onClick={close} aria-label="Fermer" className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-orange">
            <svg width="16" height="16" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4">
              <path d="m1 1 8 8M9 1 1 9" />
            </svg>
          </button>
          {shown.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Précédente"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-orange sm:left-6"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Suivante"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-orange sm:right-6"
              >
                ›
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resize(cur.url, 1600)} alt={cur.caption || cur.category} className="max-h-[78vh] rounded-2xl object-contain" />
            <figcaption className="mt-4 text-center text-white">
              <span className="text-[11px] uppercase tracking-[0.25em] text-orange">{cur.category}</span>
              {cur.caption && <p className="mt-1 text-white/80">{cur.caption}</p>}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
