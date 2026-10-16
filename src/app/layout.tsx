import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import CartToast from "@/components/CartToast";
import CommunityPopup from "@/components/CommunityPopup";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MetaPixel from "@/components/MetaPixel";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Arte textil y tufting inspirado en la naturaleza`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: "Verónica Orlando", url: site.url }],
  creator: "Verónica Orlando",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: `${site.name} · Arte textil y tufting inspirado en la naturaleza`,
    description: site.description,
    images: [{ url: "/img/agua-2.jpg", width: 2400, height: 1800, alt: site.name }],
  },
  // Verificación de Google Search Console
  verification: { google: "QHWxix9Y-90EFdDrf6vXNUQDV67pbvkpiPJq0NX7sks" },
};

export const viewport: Viewport = {
  themeColor: "#012b55",
};

// Datos del estudio para Google: nombre, artista, ubicación y redes.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${site.url}/#estudio`,
      name: site.name,
      alternateName: site.legalName,
      description: site.description,
      url: site.url,
      logo: `${site.url}/icon.png`,
      image: `${site.url}/img/agua-2.jpg`,
      email: site.email,
      telephone: `+${site.whatsapp}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "General Rodríguez",
        addressRegion: "Provincia de Buenos Aires",
        addressCountry: "AR",
      },
      areaServed: { "@type": "Country", name: "Argentina" },
      founder: { "@type": "Person", name: "Verónica Orlando", jobTitle: "Artista textil" },
      knowsAbout: ["Tufting", "Arte textil", "Tapices", "Alfombras", "Instalaciones textiles"],
      sameAs: [site.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#web`,
      url: site.url,
      name: site.name,
      inLanguage: "es-AR",
      publisher: { "@id": `${site.url}/#estudio` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <CartToast />
          <CommunityPopup />
        </CartProvider>
      </body>
      <GoogleAnalytics gaId="G-QHHQ84V33M" />
      <MetaPixel />
    </html>
  );
}
