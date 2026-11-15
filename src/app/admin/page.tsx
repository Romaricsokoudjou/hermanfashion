import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  return <AdminApp />;
}
