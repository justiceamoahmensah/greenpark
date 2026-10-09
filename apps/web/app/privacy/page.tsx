import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { getPublicConfig } from "@/lib/public-config";

export const metadata: Metadata = { title: "Privacy policy template" };

const sections = [
  {
    title: "Data we collect",
    body: "The enquiry form collects the twelve answers shown in the review screen: your name, phone number, email address, property interests and plans, any additional enquiry, and your contact-permission choice.",
  },
  {
    title: "Why we collect it",
    body: "The intended purpose is to record, understand, and respond to your specific property enquiry. The business must document its lawful basis and any additional uses before production.",
  },
  {
    title: "Storage and access",
    body: "After a successful submission, the twelve answers are stored in a restricted Google Sheet accessed through a server-side Google service account. The browser never receives the service-account credentials. Access should be limited to authorized staff and reviewed regularly.",
  },
  {
    title: "Draft recovery",
    body: "Before submission, a temporary draft is kept only in this browser tab's session storage so a refresh does not erase your progress. It is not the authoritative submitted record and can be cleared by choosing Start over or closing the browser session.",
  },
  {
    title: "Contact preference and permission",
    body: "A preferred contact method tells the team how you would like a permitted response. It is not permission by itself. Selecting No under May We Contact You means the team should not begin a sales follow-up; you may still voluntarily contact the team.",
  },
  {
    title: "Retention",
    body: "The business must insert its approved retention period and deletion process here. Google Sheet rows should not be retained longer than necessary for the stated purpose.",
  },
  {
    title: "Correction and deletion requests",
    body: "The business must confirm the identity-check process and contact channel customers can use to request access, correction, or deletion, subject to applicable law.",
  },
];

export default function PrivacyPage() {
  const config = getPublicConfig();
  return (
    <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url}>
      <article className="mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Privacy</p>
        <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Privacy policy template</h1>
        <div className="mt-6 flex gap-3 rounded-2xl border border-gold/35 bg-white p-4 text-sm leading-6 text-navy">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
          <p><strong>Legal and business approval required.</strong> This editable template is not a finalized legal notice. Replace placeholders and verify the policy against the operating company, jurisdiction, and actual practices before launch.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-navy/8 bg-white p-6 shadow-[0_12px_35px_rgba(16,43,70,0.04)]">
              <h2 className="font-display text-2xl">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-3xl bg-navy p-6 text-white sm:p-8">
          <h2 className="font-display text-3xl">Privacy contact</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
            Replace this placeholder contact with the approved privacy contact before production. Current public contact: {config.contact_email || config.contact_phone_display || config.website_url}.
          </p>
        </section>
      </article>
    </SiteChrome>
  );
}
