import type { Metadata } from "next";
import { Geist, Geist_Mono, Bodoni_Moda, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Analytics } from "@/components/layout/Analytics";
import { OrganizationJsonLd } from "@/components/layout/JsonLd";
import { SpaceBackground } from "@/components/layout/SpaceBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tipografia display "mista": serif Didone + pixel/bitmap, combinadas por letra
// nos títulos (efeito Arthemys Display Bitmap).
const displaySerif = Bodoni_Moda({
  variable: "--font-display-serif",
  subsets: ["latin"],
  display: "swap",
});

const displayBitmap = Pixelify_Sans({
  variable: "--font-display-bitmap",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuBit — Tecnologia & Crescimento",
  description:
    "Construímos sua loja, cuidamos de toda a infraestrutura e operamos seu tráfego com inteligência de dados. Você foca em vender.",
  metadataBase: new URL("https://qubit.com.br"), // TODO: domínio real
  alternates: { canonical: "/" },
  openGraph: {
    title: "QuBit — Tecnologia & Crescimento",
    description:
      "A tecnologia e o crescimento do seu negócio — num só lugar.",
    siteName: "QuBit",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/qubit_poster.png", width: 1200, height: 630, alt: "QuBit" }], // TODO: OG 1200×630 de marca
  },
  twitter: {
    card: "summary_large_image",
    title: "QuBit — Tecnologia & Crescimento",
    images: ["/qubit_poster.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} ${displayBitmap.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-ink text-text-1">
        {/* Fundo de universo global (atrás de todo o conteúdo) */}
        <SpaceBackground />

        {/* Skip link — acessibilidade */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand focus:text-paper focus:rounded-md focus:text-sm focus:font-medium"
        >
          Pular para o conteúdo
        </a>

        <Header />
        {children}
        <Footer />
        <WhatsAppFab />
        <OrganizationJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
