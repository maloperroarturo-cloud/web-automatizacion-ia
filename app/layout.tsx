import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

export const metadata: Metadata = {
  title: "NexaFlow | Optimizacion digital para negocios",
  description:
    "Optimizamos servicios, reservas, atencion y procesos digitales para que negocios locales pierdan menos oportunidades y operen con mas control.",
  keywords: [
    "optimizacion de negocios",
    "automatizacion de servicios",
    "reservas online",
    "carta QR",
    "mejora de procesos",
    "web para negocios",
    "atencion automatizada"
  ],
  openGraph: {
    title: "NexaFlow | Optimizacion digital para negocios",
    description:
      "Sistemas digitales para reducir tareas manuales, recuperar oportunidades y convertir mejor cada contacto.",
    type: "website",
    locale: "es_ES"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
