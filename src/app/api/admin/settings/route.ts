import { db } from "@/db";
import { settings } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { SETTING_DEFAULTS, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  return Response.json({ settings: await getSettings() });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  for (const [key, v] of Object.entries(body)) {
    if (!(key in SETTING_DEFAULTS)) continue;
    const value = String(v ?? "").slice(0, 5000);
    await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  return Response.json({ settings: await getSettings() });
}
