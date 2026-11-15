/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { isAdmin } from "@/lib/auth";
import { RESOURCES, clean } from "@/lib/admin-crud";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { resource, id } = await params;
  const t = RESOURCES[resource];
  if (!t) return Response.json({ error: "Introuvable" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const values = clean(resource, body);
  if ("slug" in values) {
    const s = slugify(String(values.slug));
    if (s) values.slug = s;
    else delete values.slug;
  }
  try {
    const updated = (await db.update(t).set(values as any).where(eq(t.id, Number(id))).returning()) as any[];
    return Response.json({ row: updated[0] });
  } catch {
    return Response.json({ error: "Modification impossible (valeur en doublon ?)." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { resource, id } = await params;
  const t = RESOURCES[resource];
  if (!t) return Response.json({ error: "Introuvable" }, { status: 404 });
  await db.delete(t).where(eq(t.id, Number(id)));
  return Response.json({ ok: true });
}
