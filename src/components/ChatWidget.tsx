"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["Quelles formations proposez-vous ?", "Quelles sont les durées ?", "Comment m'inscrire ?", "Comment vous contacter ?"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Bonjour et bienvenue chez HERMAN FASHION ! Je suis votre assistante virtuelle. Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const d = (await r.json()) as { reply?: string };
      setMsgs([...next, { role: "assistant", content: d.reply || "Je n'ai pas pu répondre. Merci de réessayer." }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Une erreur est survenue. Vous pouvez nous écrire via la page Contact." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-3 z-[70] flex h-[min(540px,calc(100svh-8rem))] w-[calc(100vw-1.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_30px_80px_-20px_rgba(20,17,15,0.45)] sm:right-6">
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11 .9 2.6L22.5 16l-2.6.9L19 19.5l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Assistante HERMAN FASHION</p>
              <p className="text-[11px] text-white/60">Assistance par intelligence artificielle</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-white/60 hover:text-white">
              <svg width="14" height="14" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4">
                <path d="m1 1 8 8M9 1 1 9" />
              </svg>
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-beige/60 px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                    m.role === "user" ? "rounded-br-sm bg-orange text-white" : "rounded-bl-sm bg-white text-ink shadow-sm"
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-mute shadow-sm">…</p>
              </div>
            )}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-orange/40 bg-white px-3 py-1.5 text-xs text-orange transition hover:bg-orange hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={end} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink/10 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question…"
              className="flex-1 rounded-full bg-beige px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange/30"
            />
            <button disabled={busy} className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white disabled:opacity-50" aria-label="Envoyer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20v-6l8-2-8-2V4l19 8z" />
              </svg>
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Assistance"
        className="animate-ring fixed bottom-3 right-3 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-xl transition hover:scale-105 hover:bg-orange sm:bottom-6 sm:right-6"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4">
            <path d="m1 1 8 8M9 1 1 9" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
          </svg>
        )}
      </button>
    </>
  );
}
