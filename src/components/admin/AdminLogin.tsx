"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setBusy(false);
    if (r.ok) router.refresh();
    else setError("Mot de passe incorrect.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] bg-white p-10 shadow-2xl">
        <Logo />
        <h1 className="h-display mt-8 text-3xl">Administration</h1>
        <p className="mt-1 text-sm text-mute">Accès réservé à l&apos;équipe HERMAN FASHION.</p>
        <label className="label mt-8">Mot de passe</label>
        <input type="password" autoFocus className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="btn btn-primary mt-6 w-full disabled:opacity-60">
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
