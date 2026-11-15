"use client";

import Link from "next/link";
import { useState } from "react";
import { DURATIONS, formatMoney, parseDurations } from "@/lib/format";

type F = { id: number; slug: string; name: string; durations: string };

export default function RegistrationForm({
  formations,
  fee,
  currency,
  initialSlug,
}: {
  formations: F[];
  fee: number;
  currency: string;
  initialSlug?: string;
}) {
  const initial = formations.find((f) => f.slug === initialSlug);
  const [step, setStep] = useState(initial ? 1 : 0);
  const [formationId, setFormationId] = useState<number | null>(initial?.id ?? null);
  const [duration, setDuration] = useState("");
  const [p, setP] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", country: "Cameroun", birthDate: "", level: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [method, setMethod] = useState<"mobile_money" | "cash">("mobile_money");
  const [payPhone, setPayPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ reference: string; paymentMessage: string } | null>(null);

  const formation = formations.find((f) => f.id === formationId);
  const set = (k: keyof typeof p) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value });

  function next() {
    setError("");
    if (step === 0 && (!formation || !duration)) return setError("Choisissez une formation et une durée.");
    if (step === 1) {
      if (!p.firstName || !p.lastName || !/^\S+@\S+\.\S+$/.test(p.email) || p.phone.replace(/\D/g, "").length < 8)
        return setError("Merci de renseigner correctement votre nom, prénom, email et téléphone.");
    }
    setStep(step + 1);
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, formationId, duration, consent, paymentMethod: method, paymentPhone: payPhone }),
      });
      const d = (await r.json()) as { error?: string; reference?: string; paymentMessage?: string };
      if (!r.ok || !d.reference) setError(d.error || "Une erreur est survenue.");
      else setDone({ reference: d.reference, paymentMessage: d.paymentMessage || "" });
    } catch {
      setError("Connexion impossible. Veuillez réessayer.");
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="rounded-[2rem] bg-ink p-10 text-center text-white sm:p-16">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 8.5 3.2 3.2L13 4.8" />
          </svg>
        </span>
        <h2 className="h-display mt-8 text-4xl sm:text-5xl">Inscription enregistrée !</h2>
        <p className="mt-4 text-white/70">Conservez précieusement votre référence pour suivre votre dossier :</p>
        <p className="h-display mt-4 inline-block rounded-2xl border border-orange px-8 py-4 text-4xl tracking-widest text-orange">{done.reference}</p>
        {done.paymentMessage && <p className="mx-auto mt-6 max-w-lg text-white/80">{done.paymentMessage}</p>}
        <p className="mt-4 text-sm text-white/50">Notre équipe vous contactera au {p.phone} pour la suite.</p>
        <Link href="/espace-candidat" className="btn btn-primary mt-10">
          Accéder à mon espace candidat
        </Link>
      </div>
    );

  const steps = ["Formation", "Informations", "Confirmation"];

  return (
    <div>
      <ol className="mb-10 flex items-center gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium transition ${
                i <= step ? "bg-orange text-white" : "bg-beige text-mute"
              }`}
            >
              {i + 1}
            </span>
            <span className={`hidden text-xs uppercase tracking-[0.2em] sm:block ${i === step ? "text-ink" : "text-mute"}`}>{s}</span>
            {i < 2 && <span className={`h-px flex-1 ${i < step ? "bg-orange" : "bg-ink/10"}`} />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="h-display text-3xl">Quelle formation souhaitez-vous suivre ?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {formations.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => {
                    setFormationId(f.id);
                    setDuration("");
                  }}
                  className={`rounded-2xl border p-5 text-left transition ${
                    formationId === f.id ? "border-orange bg-orange-50" : "border-ink/10 hover:border-orange/60"
                  }`}
                >
                  <span className="h-display text-xl">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
          {formation && (
            <div>
              <h3 className="h-display text-2xl">Durée</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {parseDurations(formation.durations).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`rounded-full border px-7 py-3 text-sm transition ${
                      duration === d ? "border-orange bg-orange text-white" : "border-ink/15 hover:border-orange"
                    }`}
                  >
                    {DURATIONS[d]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="h-display text-3xl">Vos informations</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Prénom *</label>
              <input className="field" value={p.firstName} onChange={set("firstName")} autoComplete="given-name" />
            </div>
            <div>
              <label className="label">Nom *</label>
              <input className="field" value={p.lastName} onChange={set("lastName")} autoComplete="family-name" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" className="field" value={p.email} onChange={set("email")} autoComplete="email" />
            </div>
            <div>
              <label className="label">Téléphone *</label>
              <input type="tel" className="field" value={p.phone} onChange={set("phone")} placeholder="6XX XX XX XX" autoComplete="tel" />
            </div>
            <div>
              <label className="label">Ville</label>
              <input className="field" value={p.city} onChange={set("city")} />
            </div>
            <div>
              <label className="label">Pays</label>
              <input className="field" value={p.country} onChange={set("country")} />
            </div>
            <div>
              <label className="label">Date de naissance</label>
              <input type="date" className="field" value={p.birthDate} onChange={set("birthDate")} />
            </div>
            <div>
              <label className="label">Niveau d&apos;études</label>
              <input className="field" value={p.level} onChange={set("level")} />
            </div>
          </div>
          <div>
            <label className="label">Message (facultatif)</label>
            <textarea rows={3} className="field" value={p.message} onChange={set("message")} />
          </div>
        </div>
      )}

      {step === 2 && formation && (
        <div className="space-y-8">
          <h2 className="h-display text-3xl">Confirmation</h2>
          <div className="rounded-3xl bg-beige p-6 text-[15px]">
            <p className="text-xs uppercase tracking-[0.2em] text-orange">Récapitulatif</p>
            <p className="h-display mt-2 text-3xl">{formation.name}</p>
            <p className="text-mute">
              {DURATIONS[duration]} · {p.firstName} {p.lastName} · {p.email}
            </p>
          </div>

          {fee > 0 ? (
            <div>
              <div className="flex items-baseline justify-between border-b border-ink/10 pb-4">
                <h3 className="h-display text-2xl">Frais d&apos;inscription</h3>
                <p className="h-display text-3xl text-orange">{formatMoney(fee, currency)}</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["mobile_money", "Mobile Money", "Orange Money · MTN MoMo"],
                    ["cash", "Au centre", "Paiement sur place"],
                  ] as const
                ).map(([k, t, d]) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => setMethod(k)}
                    className={`rounded-2xl border p-5 text-left transition ${method === k ? "border-orange bg-orange-50" : "border-ink/10 hover:border-orange/60"}`}
                  >
                    <span className="block font-semibold">{t}</span>
                    <span className="text-sm text-mute">{d}</span>
                  </button>
                ))}
              </div>
              {method === "mobile_money" && (
                <div className="mt-5">
                  <label className="label">Numéro Mobile Money (par défaut : votre téléphone)</label>
                  <input className="field" value={payPhone} onChange={(e) => setPayPhone(e.target.value)} placeholder={p.phone} />
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-ink/20 p-5 text-sm text-mute">
              Les modalités de paiement vous seront communiquées par notre équipe après réception de votre dossier.
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm text-mute">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-orange" />
            J&apos;accepte que mon prénom, l&apos;initiale de mon nom et ma ville apparaissent dans les notifications d&apos;inscription du site (facultatif).
          </label>
        </div>
      )}

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-10 flex items-center justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">
            Retour
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button type="button" onClick={next} className="btn btn-primary">
            Continuer
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={busy} className="btn btn-primary disabled:opacity-60">
            {busy ? "Envoi en cours…" : fee > 0 && method === "mobile_money" ? `Payer ${formatMoney(fee, currency)}` : "Confirmer mon inscription"}
          </button>
        )}
      </div>
    </div>
  );
}
