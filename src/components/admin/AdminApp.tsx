"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../Logo";
import { RESOURCES, SETTINGS_GROUPS, formatDate, type Field, type Resource, type Row } from "./config";
import { formatMoney } from "@/lib/format";

type Stats = {
  registrations: number;
  newRegistrations: number;
  unreadMessages: number;
  revenue: number;
  formations: number;
  teachers: number;
  gallery: number;
  testimonials: number;
  paymentGateway: boolean;
  ai: boolean;
};

export default function AdminApp() {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  const tabs = [
    { key: "dashboard", label: "Tableau de bord" },
    ...RESOURCES.map((r) => ({ key: r.key, label: r.label })),
    { key: "settings", label: "Paramètres" },
  ];
  const resource = RESOURCES.find((r) => r.key === tab);

  return (
    <div className="min-h-screen bg-beige/60 lg:flex">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between p-5 lg:block">
          <Logo light />
          <button onClick={logout} className="text-xs text-white/50 hover:text-orange lg:mt-6 lg:block">
            Déconnexion
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm transition ${
                tab === t.key ? "bg-orange text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
          <Link href="/" className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm text-white/50 hover:text-orange">
            ↗ Voir le site
          </Link>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 lg:p-10">
        {tab === "dashboard" && <Dashboard go={setTab} />}
        {resource && <Crud key={resource.key} res={resource} />}
        {tab === "settings" && <SettingsForm />}
      </main>
    </div>
  );
}

function Dashboard({ go }: { go: (t: string) => void }) {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setS);
  }, []);
  if (!s) return <p className="text-mute">Chargement…</p>;
  const cards: [string, string | number, string][] = [
    ["Inscriptions", s.registrations, "registrations"],
    ["Nouvelles inscriptions", s.newRegistrations, "registrations"],
    ["Paiements encaissés", formatMoney(s.revenue), "registrations"],
    ["Messages non lus", s.unreadMessages, "messages"],
    ["Formations", s.formations, "formations"],
    ["Enseignants", s.teachers, "teachers"],
    ["Photographies", s.gallery, "gallery"],
    ["Témoignages", s.testimonials, "testimonials"],
  ];
  return (
    <div>
      <h1 className="h-display text-4xl">Tableau de bord</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v, t]) => (
          <button key={l} onClick={() => go(t)} className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-mute">{l}</p>
            <p className="h-display mt-2 text-4xl text-orange">{v}</p>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="font-semibold">Paiement en ligne (Mobile Money)</p>
          <p className={`mt-2 text-sm ${s.paymentGateway ? "text-green-700" : "text-mute"}`}>
            {s.paymentGateway
              ? "Passerelle active : les paiements sont initiés et vérifiés automatiquement."
              : "Passerelle non configurée : les paiements restent « en attente » et sont validés manuellement dans Inscriptions. Pour l'activer, définissez la variable d'environnement CAMPAY_TOKEN."}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="font-semibold">Assistante IA</p>
          <p className={`mt-2 text-sm ${s.ai ? "text-green-700" : "text-mute"}`}>
            {s.ai
              ? "Modèle d'IA actif sur le chat du site."
              : "Mode intégré (réponses fondées sur vos formations et coordonnées). Pour activer un modèle d'IA, définissez OPENAI_API_KEY."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Crud({ res }: { res: Resource }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Row>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/${res.key}`);
    const d = (await r.json()) as { rows?: Row[] };
    setRows(d.rows ?? []);
    setLoading(false);
  }, [res.key]);

  useEffect(() => {
    load();
  }, [load]);

  function open(row: Row | "new") {
    setError("");
    if (row === "new") {
      const init: Row = {};
      for (const f of res.fields) init[f.key] = f.type === "checkbox" ? (f.key === "read" ? false : true) : f.type === "number" ? 0 : f.type === "date" ? new Date().toISOString().slice(0, 10) : "";
      if (res.key === "formations") init.durations = "3,6,12";
      if (res.key === "gallery") init.category = "Réalisations professionnelles";
      setForm(init);
    } else {
      const f: Row = { ...row };
      for (const fd of res.fields) if (fd.type === "date" && f[fd.key]) f[fd.key] = String(f[fd.key]).slice(0, 10);
      setForm(f);
    }
    setEdit(row);
  }

  async function save() {
    setBusy(true);
    setError("");
    const payload: Row = {};
    for (const f of res.fields) if (!f.readOnly) payload[f.key] = form[f.key] ?? "";
    const isNew = edit === "new";
    const r = await fetch(isNew ? `/api/admin/${res.key}` : `/api/admin/${res.key}/${(edit as Row).id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!r.ok) return setError(((await r.json().catch(() => ({}))) as { error?: string }).error || "Erreur.");
    setEdit(null);
    load();
  }

  async function remove(row: Row) {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    await fetch(`/api/admin/${res.key}/${row.id}`, { method: "DELETE" });
    load();
  }

  async function toggle(row: Row, key: string) {
    await fetch(`/api/admin/${res.key}/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: !row[key] }),
    });
    load();
  }

  const cell = (row: Row, c: Resource["columns"][number]) => {
    if (c.render) return c.render(row);
    const v = row[c.key];
    if (c.kind === "image")
      // eslint-disable-next-line @next/next/no-img-element
      return v ? <img src={String(v)} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <span className="block h-12 w-12 rounded-lg bg-beige" />;
    if (c.kind === "bool")
      return (
        <button onClick={() => toggle(row, c.key)} className={`rounded-full px-3 py-1 text-xs ${v ? "bg-green-100 text-green-800" : "bg-ink/10 text-mute"}`}>
          {v ? "Oui" : "Non"}
        </button>
      );
    if (c.kind === "date") return v ? formatDate(String(v)) : "";
    return String(v ?? "");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="h-display text-4xl">{res.label}</h1>
        <div className="flex gap-3">
          {res.csv && (
            <a href={`/api/admin/${res.key}?format=csv`} className="btn btn-outline !py-2.5">
              Exporter CSV
            </a>
          )}
          {res.canCreate !== false && (
            <button onClick={() => open("new")} className="btn btn-primary !py-2.5">
              + Ajouter
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-mute">
            <tr>
              {res.columns.map((c) => (
                <th key={c.key} className="px-5 py-4 font-medium">
                  {c.label}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-5 py-8 text-mute">Chargement…</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={res.columns.length + 1} className="px-5 py-10 text-center text-mute">
                  Aucun élément pour le moment.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-ink/5 last:border-0 hover:bg-beige/40">
                {res.columns.map((c) => (
                  <td key={c.key} className="max-w-xs truncate px-5 py-3">
                    {cell(row, c)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-5 py-3 text-right">
                  <button onClick={() => open(row)} className="mr-4 text-orange hover:underline">
                    {res.canCreate === false ? "Détails" : "Modifier"}
                  </button>
                  <button onClick={() => remove(row)} className="text-red-600 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
            <div className="flex items-center justify-between">
              <h2 className="h-display text-3xl">{edit === "new" ? `Ajouter : ${res.singular}` : `Modifier : ${res.singular}`}</h2>
              <button onClick={() => setEdit(null)} className="text-2xl text-mute hover:text-ink" aria-label="Fermer">
                ×
              </button>
            </div>
            <div className="mt-6 space-y-5">
              {res.fields.map((f) => (
                <FieldInput key={f.key} f={f} value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />
              ))}
            </div>
            {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setEdit(null)} className="btn btn-outline !py-3">
                Annuler
              </button>
              <button onClick={save} disabled={busy} className="btn btn-primary !py-3 disabled:opacity-60">
                {busy ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: Row[string] | undefined; onChange: (v: string | number | boolean) => void }) {
  const v = value ?? "";
  if (f.readOnly)
    return (
      <div>
        <p className="label">{f.label}</p>
        <p className="whitespace-pre-line rounded-xl bg-beige/60 px-4 py-3 text-sm">{String(v) || "—"}</p>
      </div>
    );
  if (f.type === "checkbox")
    return (
      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-orange" />
        {f.label}
      </label>
    );
  return (
    <div>
      <label className="label">{f.label}</label>
      {f.type === "textarea" ? (
        <textarea rows={4} className="field" value={String(v)} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === "select" ? (
        <select className="field" value={String(v)} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
          className="field"
          value={String(v)}
          onChange={(e) => onChange(f.type === "number" ? e.target.value : e.target.value)}
        />
      )}
      {f.hint && <p className="mt-1.5 text-xs text-mute">{f.hint}</p>}
    </div>
  );
}

function SettingsForm() {
  const [vals, setVals] = useState<Row | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d: { settings: Row }) => setVals(d.settings));
  }, []);

  async function save() {
    setBusy(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vals) });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!vals) return <p className="text-mute">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="h-display text-4xl">Paramètres du site</h1>
        <button onClick={save} disabled={busy} className="btn btn-primary !py-2.5 disabled:opacity-60">
          {saved ? "Enregistré ✓" : busy ? "…" : "Enregistrer"}
        </button>
      </div>
      <div className="mt-8 space-y-8">
        {SETTINGS_GROUPS.map((g) => (
          <section key={g.title} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="h-display text-2xl">{g.title}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <FieldInput f={f} value={vals[f.key]} onChange={(v) => setVals({ ...vals, [f.key]: v })} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
