import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Fleet } from "@/components/sections/Fleet";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getSiteSettings } from "@/lib/queries";
import type { SiteSettings } from "@/types";
import ogImageAsset from "@/assets/og-image.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "NEWEN — Transporte de Pasajeros en Uruguay | Turismo, Transfers y Eventos",
    meta: [
      { name: "description", content: "NEWEN: traslados ejecutivos, turismo, eventos y chárter en Uruguay con Mercedes-Benz Sprinter y Renault Master. Puntualidad y confort premium garantizados." },
      { property: "og:title", content: "NEWEN — Transporte de Pasajeros en Uruguay" },
      { property: "og:description", content: "Traslados ejecutivos, turismo y eventos con Mercedes-Benz Sprinter y Renault Master. Calidad premium en todo Uruguay." },
      { property: "og:url", content: "https://newen.com.uy" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_UY" },
      { property: "og:image", content: ogImageAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NEWEN — Transporte de Pasajeros en Uruguay" },
      { name: "twitter:description", content: "Traslados ejecutivos y turismo premium en Uruguay." },
      { name: "twitter:image", content: ogImageAsset.url },
    ],
    links: [
      { rel: "canonical", href: "https://newen.com.uy" }
    ]
  }),
});

function Index() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TransportService",
    "name": "NEWEN",
    "url": "https://newen.com.uy",
    "telephone": "+59899738955",
    "description": "Transporte de pasajeros premium, traslados ejecutivos, turismo y eventos en Uruguay.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "NEWEN",
      "image": ogImageAsset.url,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "UY"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Uruguay"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+59899738955",
      "contactType": "customer service",
      "url": "https://wa.me/59899738955"
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Fleet />
        <Blog />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton phoneNumber={settings?.whatsapp_number || "59899738955"} />
    </div>
  );
}
