"use client";

import { useEffect, useState } from "react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { fetchConfig } from "@/lib/api";
import type { PublicConfig } from "@/lib/types";

export function HomePage({ developmentSlug }: { developmentSlug: string | null }) {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch(() => setError("The enquiry service is unavailable right now. Please try again shortly."));
  }, []);

  if (error) {
    return (
      <SiteChrome companyName="Enquiry">
        <p className="px-5 py-16" role="alert">
          {error}
        </p>
      </SiteChrome>
    );
  }
  if (!config) {
    return (
      <SiteChrome companyName="Enquiry">
        <p className="px-5 py-16">Preparing the enquiry.</p>
      </SiteChrome>
    );
  }
  const development = config.developments.find((item) => item.slug === developmentSlug && item.qr_enabled) ?? null;
  const startHref = development ? `/enquire?development=${development.slug}` : "/enquire";
  return (
    <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url}>
      <WelcomeScreen
        config={config}
        development={development}
        invalidDevelopment={Boolean(developmentSlug) && !development}
        startHref={startHref}
      />
    </SiteChrome>
  );
}
