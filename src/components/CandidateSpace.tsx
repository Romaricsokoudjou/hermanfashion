"use client";

import Link from "next/link";
import { useState } from "react";
import { DURATIONS, PAY_STATUS, REG_STATUS, formatDate, formatMoney } from "@/lib/format";

type Reg = {
  reference: string;
  firstName: string;
  lastName: string;
  formationName: string;
  duration: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
  canPayOnline: boolean;
};

export default function CandidateSpace() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [reg, setReg] = useState<Reg | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(action?: string) {
    setBusy(true);
    setError("");
    setNote("");
    try {
      const r = await fetch("/api/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email, action }),
      });
      const d = (await r.json()) as { error?: string; registration?: Reg; note?: string };
      if (!r.ok || !d.registration) {
        setError(d.error || "Erreur.");
        setReg(null);
      } else {
        setReg(d.registration);
        setNote(d.note || "");
      }
    } finally {
      setBusy(false);
    }
  }

  const tone = (s: string) => (s === "paye" || s === "accepte" || s === "inscrit" ? "bg-green-100 text-green-800" : s === "echec" || s === "refuse" ? "bg-red-100 text-red-800" : "bg-orange-50 text-orange-600");

  if (!reg)
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          call();
        }}
        className="space-y-5"
      >
        <div>
          <label className="label">Référence du dossier</label>
          <input required className="field uppercase" placeholder="HF-2025-XXXXX" value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
        <div>
          <label className="label">Email utilisé lors de l&apos;inscription</label>
          <input required type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
          {busy ? "Recherche…" : "Accéder à mon dossier"}
        </button>
        <p className="text-center text-sm text-mute">
          Pas encore inscrit ?{" "}
          <Link href="/inscription" className="text-orange underline">
            S&apos;inscrire maintenant
          </Link>
        </p>
      </form>
    );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange">Bonjour</p>
        <h2 className="h-display text-4xl">
          {reg.firstName} {reg.lastName}
        </h2>
        <p className="mt-1 text-sm text-mute">
          Dossier {reg.reference} · déposé le {formatDate(reg.createdAt)}
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-beige p-5">
          <dt className="text-xs uppercase tracking-[0.2em] text-mute">Formation</dt>
          <dd className="h-display mt-1 text-2xl">{reg.formationName}</dd>
          <dd className="text-sm text-mute">{DURATIONS[reg.duration] ?? reg.duration}</dd>
        </div>
        <div className="rounded-2xl bg-beige p-5">
          <dt className="text-xs uppercase tracking-[0.2em] text-mute">Statut du dossier</dt>
          <dd className="mt-2">
            <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${tone(reg.status)}`}>{REG_STATUS[reg.status] ?? reg.status}</span>
          </dd>
        </div>
        <div className="rounded-2xl bg-beige p-5 sm:col-span-2">
          <dt className="text-xs uppercase tracking-[0.2em] text-mute">Frais d&apos;inscription</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-3">
            {reg.amount > 0 && <span className="h-display text-3xl">{formatMoney(reg.amount)}</span>}
            <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${tone(reg.paymentStatus)}`}>{PAY_STATUS[reg.paymentStatus] ?? reg.paymentStatus}</span>
          </dd>
        </div>
      </dl>
      {note && <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-600">{note}</p>}
      <div className="flex flex-wrap gap-3">
        {reg.paymentStatus === "en_attente" && (
          <button onClick={() => call("check")} disabled={busy} className="btn btn-outline">
            Vérifier mon paiement
          </button>
        )}
        {reg.canPayOnline && (
          <button onClick={() => call("pay")} disabled={busy} className="btn btn-primary">
            Payer par Mobile Money
          </button>
        )}
        <button onClick={() => setReg(null)} className="btn btn-outline">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
