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

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "NEWEN - Transporte de Pasajeros y Turismo en Uruguay",
    meta: [
      { name: "description", content: "NEWEN ofrece traslados ejecutivos, turismo, eventos sociales y chárter en minibuses de última generación en Uruguay." },
      { property: "og:title", content: "NEWEN - Transporte de Pasajeros y Turismo" },
      { property: "og:description", content: "NEWEN ofrece traslados ejecutivos, turismo, eventos sociales y chárter en minibuses de última generación en Uruguay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
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
