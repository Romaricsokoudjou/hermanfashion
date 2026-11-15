import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export const formations = pgTable("formations", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  objectives: text("objectives").notNull().default(""),
  skills: text("skills").notNull().default(""),
  program: text("program").notNull().default(""),
  careers: text("careers").notNull().default(""),
  durations: text("durations").notNull().default("3,6,12"),
  image: text("image").notNull().default(""),
  gallery: text("gallery").notNull().default(""),
  videoUrl: text("video_url").notNull().default(""),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull().default(""),
  experience: text("experience").notNull().default(""),
  bio: text("bio").notNull().default(""),
  skills: text("skills").notNull().default(""),
  photo: text("photo").notNull().default(""),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  category: text("category").notNull().default("Réalisations professionnelles"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull().default(""),
  formation: text("formation").notNull().default(""),
  content: text("content").notNull().default(""),
  photo: text("photo").notNull().default(""),
  videoUrl: text("video_url").notNull().default(""),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const centers = pgTable("centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull().default(""),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  hours: text("hours").notNull().default(""),
  mapUrl: text("map_url").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  image: text("image").notNull().default(""),
  active: boolean("active").notNull().default(true),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default("Cameroun"),
  birthDate: text("birth_date").notNull().default(""),
  level: text("level").notNull().default(""),
  formationId: integer("formation_id"),
  formationName: text("formation_name").notNull().default(""),
  duration: text("duration").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("nouveau"),
  paymentStatus: text("payment_status").notNull().default("non_requis"),
  paymentMethod: text("payment_method").notNull().default(""),
  paymentRef: text("payment_ref").notNull().default(""),
  amount: integer("amount").notNull().default(0),
  publicNotice: boolean("public_notice").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull().default(""),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
