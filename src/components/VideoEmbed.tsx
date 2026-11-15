"use client";

import { useState } from "react";

function parse(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "youtube" as const, id: yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "vimeo" as const, id: vm[1] };
  return { type: "file" as const, id: "" };
}

export default function VideoEmbed({
  url,
  title,
  poster,
  className = "",
  dark = false,
}: {
  url: string;
  title: string;
  poster?: string;
  className?: string;
  dark?: boolean;
}) {
  const [play, setPlay] = useState(false);

  if (!url) {
    return (
      <div
        className={`relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed ${
          dark ? "border-white/25 bg-white/5 text-white/70" : "border-ink/20 bg-beige text-mute"
        } ${className}`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/90 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <p className="mt-4 text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs opacity-70">Vidéo bientôt disponible</p>
      </div>
    );
  }

  const v = parse(url);

  if (v.type === "file") {
    return (
      <video
        controls
        preload="metadata"
        poster={poster}
        className={`aspect-video w-full rounded-3xl bg-black object-cover shadow-2xl ${className}`}
        title={title}
      >
        <source src={url} />
      </video>
    );
  }

  const embed =
    v.type === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${v.id}?autoplay=1`;
  const thumb = poster || (v.type === "youtube" ? `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg` : "");

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-3xl bg-ink shadow-2xl ${className}`}>
      {play ? (
        <iframe
          src={embed}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Lire : ${title}`}>
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          )}
          <span className="absolute inset-0 bg-ink/30 transition group-hover:bg-ink/10" />
          <span className="animate-ring absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange text-white">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
