import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-beige pb-16 pt-36 lg:pb-24 lg:pt-44">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-orange/20" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-[18rem] w-[18rem] rounded-full border border-orange/30" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow animate-fadeup">{eyebrow}</p>
        <h1 className="h-display animate-fadeup mt-5 max-w-4xl text-5xl sm:text-6xl lg:text-7xl" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        {intro && (
          <p className="animate-fadeup mt-6 max-w-2xl text-lg leading-relaxed text-mute" style={{ animationDelay: "240ms" }}>
            {intro}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
