import { db } from "@/db";
import { formations, teachers, gallery, testimonials, centers, news } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { ensureSeed } from "./seed";

export async function getFormations(onlyActive = true) {
  await ensureSeed();
  const q = db.select().from(formations);
  const rows = onlyActive ? await q.where(eq(formations.active, true)).orderBy(asc(formations.sortOrder), asc(formations.id)) : await q.orderBy(asc(formations.sortOrder));
  return rows;
}

export async function getFormation(slug: string) {
  await ensureSeed();
  const [row] = await db
    .select()
    .from(formations)
    .where(and(eq(formations.slug, slug), eq(formations.active, true)));
  return row ?? null;
}

export async function getTeachers() {
  await ensureSeed();
  return db.select().from(teachers).where(eq(teachers.active, true)).orderBy(asc(teachers.sortOrder), asc(teachers.id));
}

export async function getGallery() {
  await ensureSeed();
  return db.select().from(gallery).orderBy(asc(gallery.sortOrder), desc(gallery.id));
}

export async function getTestimonials() {
  await ensureSeed();
  return db.select().from(testimonials).where(eq(testimonials.approved, true)).orderBy(desc(testimonials.createdAt));
}

export async function getCenters() {
  await ensureSeed();
  return db.select().from(centers).orderBy(asc(centers.sortOrder), asc(centers.id));
}

export async function getNews() {
  await ensureSeed();
  return db.select().from(news).where(eq(news.active, true)).orderBy(desc(news.publishedAt));
}

export async function getNewsItem(slug: string) {
  await ensureSeed();
  const [row] = await db
    .select()
    .from(news)
    .where(and(eq(news.slug, slug), eq(news.active, true)));
  return row ?? null;
}
