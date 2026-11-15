import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegistrationToaster from "@/components/RegistrationToaster";
import ChatWidget from "@/components/ChatWidget";
import { getSettings } from "@/lib/settings";
import { getFormations } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [s, formations] = await Promise.all([getSettings(), getFormations()]);
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer s={s} formations={formations.map((f) => ({ slug: f.slug, name: f.name }))} />
      <RegistrationToaster />
      <ChatWidget />
    </>
  );
}
