"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { kind: "registration" | "open"; title: string; text: string; meta?: string; href?: string };

const INTERVAL = 10_000; // une notification toutes les 10 secondes
const VISIBLE = 6_000; // visible pendant 6 secondes

export default function RegistrationToaster() {
  const [items, setItems] = useState<Item[]>([]);
  const [cur, setCur] = useState<Item | null>(null);
  const [leaving, setLeaving] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d: { items: Item[] }) => alive && setItems(d.items ?? []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let iv: ReturnType<typeof setInterval> | undefined;

    const show = () => {
      const it = items[idx.current % items.length];
      idx.current += 1;
      setLeaving(false);
      setCur(it);
      timers.push(setTimeout(() => setLeaving(true), VISIBLE));
      timers.push(setTimeout(() => setCur(null), VISIBLE + 450));
    };

    const first = setTimeout(() => {
      show();
      iv = setInterval(show, INTERVAL);
    }, 3500);

    return () => {
      clearTimeout(first);
      if (iv) clearInterval(iv);
      timers.forEach(clearTimeout);
    };
  }, [items]);

  if (!cur) return null;

  const body = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-white">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 8.5 3.2 3.2L13 4.8" />
        </svg>
      </span>
      <div className="min-w-0 flex-1 pr-5">
        <p className="text-[13px] font-semibold leading-snug text-ink">{cur.title}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-ink/70">{cur.text}</p>
        {cur.meta && <p className="mt-1 text-[11px] uppercase tracking-wider text-orange">{cur.meta}</p>}
      </div>
    </div>
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 left-3 right-[5rem] z-[60] sm:bottom-6 sm:left-6 sm:right-auto sm:w-[360px]"
      style={{ animation: `${leaving ? "toast-out" : "toast-in"} 0.45s cubic-bezier(0.2,0.7,0.2,1) forwards` }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-orange bg-white p-3.5 shadow-[0_12px_32px_-12px_rgba(20,17,15,0.3)] sm:p-4">
        {cur.href ? (
          <Link href={cur.href} className="block">
            {body}
          </Link>
        ) : (
          body
        )}
        <button
          onClick={() => setLeaving(true)}
          aria-label="Fermer"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-ink/40 transition hover:bg-beige hover:text-ink"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5">
            <path d="m1 1 8 8M9 1 1 9" />
          </svg>
        </button>
        <span
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-orange"
          style={{ animation: `progress ${VISIBLE}ms linear forwards` }}
        />
      </div>
    </div>
  );
}
