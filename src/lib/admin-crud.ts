/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTableColumns } from "drizzle-orm";
import { formations, teachers, gallery, testimonials, centers, news, registrations, messages } from "@/db/schema";

export const RESOURCES: Record<string, any> = { formations, teachers, gallery, testimonials, centers, news, registrations, messages };

// Champs modifiables pour les ressources en lecture seule partielle
export const EDITABLE: Record<string, string[]> = {
  registrations: ["status", "paymentStatus"],
  messages: ["read"],
};
export const NO_CREATE = new Set(["registrations", "messages"]);

export function clean(resource: string, body: Record<string, unknown>) {
  const t = RESOURCES[resource];
  const cols = getTableColumns(t) as Record<string, any>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    const c = cols[k];
    if (!c || k === "id" || k === "createdAt") continue;
    if (EDITABLE[resource] && !EDITABLE[resource].includes(k)) continue;
    switch (c.dataType) {
      case "boolean":
        out[k] = v === true || v === "true" || v === 1;
        break;
      case "number":
        out[k] = v === "" || v == null ? (c.notNull ? 0 : null) : Number(v) || 0;
        break;
      case "date": {
        const d = v ? new Date(String(v)) : null;
        out[k] = d && !isNaN(d.getTime()) ? d : c.notNull ? new Date() : null;
        break;
      }
      default:
        out[k] = v == null ? "" : String(v).slice(0, 20000);
    }
  }
  return out;
}
