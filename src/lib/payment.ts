// Passerelle de paiement Mobile Money (Orange Money / MTN MoMo) via Campay.
// Variables d'environnement : CAMPAY_TOKEN (obligatoire pour activer), CAMPAY_BASE_URL (facultatif).
// Sans jeton, les paiements restent « en attente » et sont validés par l'administration.

export function paymentConfigured() {
  return !!process.env.CAMPAY_TOKEN;
}

function base() {
  return (process.env.CAMPAY_BASE_URL || "https://www.campay.net").replace(/\/$/, "");
}

export function normalizePhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 9 && d.startsWith("6")) return "237" + d;
  if (d.startsWith("237") && d.length === 12) return d;
  return d;
}

export async function initiatePayment(opts: {
  amount: number;
  phone: string;
  reference: string;
  description: string;
}): Promise<{ ok: boolean; providerRef?: string; message: string }> {
  if (!paymentConfigured()) return { ok: false, message: "Passerelle non configurée" };
  try {
    const res = await fetch(`${base()}/api/collect/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Token ${process.env.CAMPAY_TOKEN}` },
      body: JSON.stringify({
        amount: String(opts.amount),
        currency: "XAF",
        from: normalizePhone(opts.phone),
        description: opts.description,
        external_reference: opts.reference,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { reference?: string; message?: string; detail?: string };
    if (!res.ok || !data.reference) {
      return { ok: false, message: data.message || data.detail || "Le paiement n'a pas pu être initié." };
    }
    return { ok: true, providerRef: data.reference, message: "Demande de paiement envoyée sur votre téléphone." };
  } catch {
    return { ok: false, message: "Service de paiement indisponible." };
  }
}

export async function checkPayment(providerRef: string): Promise<"paye" | "echec" | "en_attente"> {
  if (!paymentConfigured() || !providerRef) return "en_attente";
  try {
    const res = await fetch(`${base()}/api/transaction/${providerRef}/`, {
      headers: { Authorization: `Token ${process.env.CAMPAY_TOKEN}` },
      cache: "no-store",
    });
    const data = (await res.json()) as { status?: string };
    if (data.status === "SUCCESSFUL") return "paye";
    if (data.status === "FAILED") return "echec";
    return "en_attente";
  } catch {
    return "en_attente";
  }
}
