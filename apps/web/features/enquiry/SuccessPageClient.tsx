"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { fetchConfig } from "@/lib/api";
import { readSuccess } from "@/lib/draft";
import type { PublicConfig, Submission } from "@/lib/types";
import { SuccessPanel } from "./SuccessPanel";

export function SuccessPageClient() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetchConfig()
      .then((nextConfig) => {
        if (!active) return;
        setSubmission(readSuccess());
        setConfig(nextConfig);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready || !config) {
    return <SiteChrome companyName="Property enquiry"><p className="px-5 py-24 text-center text-muted">Preparing your confirmation…</p></SiteChrome>;
  }

  if (!submission) {
    return (
      <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url}>
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="font-display text-5xl">No confirmed submission found</h1>
          <p className="mt-4 leading-relaxed text-muted">This page only confirms an enquiry after Google Sheets acknowledges it in this browser session.</p>
          <Link href="/enquire" className="mt-8 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white">Start an enquiry</Link>
        </div>
      </SiteChrome>
    );
  }

  return <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url}><SuccessPanel submission={submission} /></SiteChrome>;
}
