import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HERMAN FASHION — Centre de formation aux métiers de la beauté à Douala",
    template: "%s | HERMAN FASHION",
  },
  description:
    "HERMAN FASHION, institut de beauté et centre de formation professionnelle à Douala (Cameroun) : coiffure, esthétique, onglerie, maquillage, massage et bien-être.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
