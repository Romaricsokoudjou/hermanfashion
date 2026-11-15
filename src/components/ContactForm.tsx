"use client";

import { useState } from "react";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setError("");
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) setState("done");
    else {
      setState("idle");
      setError(((await r.json().catch(() => ({}))) as { error?: string }).error || "Erreur d'envoi.");
    }
  }

  if (state === "done")
    return (
      <div className="rounded-3xl bg-orange-50 p-10 text-center">
        <p className="h-display text-4xl text-orange">Merci !</p>
        <p className="mt-3 text-mute">Votre message a bien été envoyé. Notre équipe vous répondra très prochainement.</p>
      </div>
    );

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Nom complet *</label>
          <input required className="field" value={f.name} onChange={set("name")} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="field" value={f.email} onChange={set("email")} />
        </div>
        <div>
          <label className="label">Téléphone</label>
          <input className="field" value={f.phone} onChange={set("phone")} />
        </div>
        <div>
          <label className="label">Sujet</label>
          <input className="field" value={f.subject} onChange={set("subject")} />
        </div>
      </div>
      <div>
        <label className="label">Message *</label>
        <textarea required rows={6} className="field" value={f.message} onChange={set("message")} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={state === "busy"} className="btn btn-primary disabled:opacity-60">
        {state === "busy" ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
