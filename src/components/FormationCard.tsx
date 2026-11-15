import Link from "next/link";
import Img from "./Img";
import { durationLabel, parseDurations } from "@/lib/format";

type F = { slug: string; name: string; tagline: string; image: string; durations: string };

export default function FormationCard({ f, index }: { f: F; index: number }) {
  return (
    <Link
      href={`/formations/${f.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink shadow-[0_20px_50px_-25px_rgba(20,17,15,0.5)]"
    >
      <Img src={f.image} alt={f.name} w={800} className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90" />
      <span className="h-display absolute left-6 top-5 text-5xl italic text-white/90">{String(index + 1).padStart(2, "0")}</span>
      <span className="absolute right-5 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition duration-500 group-hover:rotate-45 group-hover:bg-orange group-hover:text-white group-hover:opacity-100">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 11 11 3M5 3h6v6" />
        </svg>
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="h-display text-3xl">{f.name}</h3>
        <p className="mt-2 text-sm text-white/70">{f.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {parseDurations(f.durations).map((d) => (
            <span key={d} className="rounded-full border border-white/30 px-3 py-1 text-[11px] uppercase tracking-wider backdrop-blur">
              {durationLabel(d)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
