export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white">
        <span className="h-display text-[22px] italic leading-none">H</span>
        <span className="absolute -inset-1 rounded-full border border-orange/40" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[17px] font-semibold tracking-[0.32em] ${light ? "text-white" : "text-ink"}`}>HERMAN</span>
        <span className={`mt-1 text-[9px] font-medium uppercase tracking-[0.5em] ${light ? "text-white/70" : "text-orange"}`}>
          Fashion · Beauty
        </span>
      </span>
    </span>
  );
}
