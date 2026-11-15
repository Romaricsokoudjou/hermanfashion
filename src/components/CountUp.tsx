"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d[\d\s.,]*)(.*)$/);
  const target = match ? parseInt(match[2].replace(/\D/g, ""), 10) : NaN;
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!match || Number.isNaN(target)) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1600;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!match || Number.isNaN(target)) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {match[1]}
      {n.toLocaleString("fr-FR")}
      {match[3]}
    </span>
  );
}
