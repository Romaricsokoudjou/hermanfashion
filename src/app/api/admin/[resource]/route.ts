/* eslint-disable @typescript-eslint/no-explicit-any */
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { isAdmin } from "@/lib/auth";
import { RESOURCES, NO_CREATE, clean } from "@/lib/admin-crud";
import { ensureSeed } from "@/lib/seed";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

function csvCell(v: unknown) {
  const s = v instanceof Date ? v.toISOString() : String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { resource } = await params;
  const t = RESOURCES[resource];
  if (!t) return Response.json({ error: "Introuvable" }, { status: 404 });
  await ensureSeed();
  const order = t.sortOrder ? [asc(t.sortOrder), desc(t.id)] : [desc(t.createdAt)];
  const rows = await db.select().from(t).orderBy(...order);

  if (resource === "registrations" && new URL(req.url).searchParams.get("format") === "csv") {
    const keys = ["reference", "createdAt", "firstName", "lastName", "email", "phone", "city", "country", "formationName", "duration", "status", "paymentStatus", "paymentMethod", "amount"];
    const csv = [keys.join(","), ...(rows as any[]).map((r) => keys.map((k) => csvCell(r[k])).join(","))].join("\n");
    return new Response("\ufeff" + csv, {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="inscriptions.csv"' },
    });
  }
  return Response.json({ rows });
}

export async function POST(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { resource } = await params;
  const t = RESOURCES[resource];
  if (!t || NO_CREATE.has(resource)) return Response.json({ error: "Introuvable" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const values = clean(resource, body);

  if (resource === "formations" || resource === "news") {
    const base = slugify(String(values.slug || values.name || values.title || "")) || "element";
    let slug = base;
    for (let i = 0; i < 8; i++) {
      const [ex] = await db.select({ id: t.id }).from(t).where(eq(t.slug, slug));
      if (!ex) break;
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    }
    values.slug = slug;
  }
  try {
    const inserted = (await db.insert(t).values(values as any).returning()) as any[];
    return Response.json({ row: inserted[0] });
  } catch (e) {
    return Response.json({ error: "Champs invalides ou incomplets." }, { status: 400 });
  }
}
