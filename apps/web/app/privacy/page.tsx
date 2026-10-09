import type { Metadata } from "next";
import { SiteChrome } from "@/components/site/SiteChrome";
import { getPublicConfig } from "@/lib/public-config";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    title: "Data we collect",
    body: "The enquiry form collects the twelve answers shown in the review screen: your name, phone number, email address, property interests and plans, any additional enquiry, and your contact-permission choice.",
  },
  {
    title: "Why we collect it",
    body: "We use this information to understand and respond to your property enquiry, arrange requested services, and communicate with you using your preferred contact method.",
  },
  {
    title: "Storage and access",
    body: "Submitted enquiries are stored securely and are accessible only to authorized team members who need the information to assist you.",
  },
  {
    title: "Draft recovery",
    body: "Before submission, your progress is saved temporarily in your current browser session so a refresh does not erase your answers. You can clear it by choosing Start over or closing the session.",
  },
  {
    title: "Contact preference and permission",
    body: "A preferred contact method tells the team how you would like a permitted response. It is not permission by itself. Selecting No under May We Contact You means the team should not begin a sales follow-up; you may still voluntarily contact the team.",
  },
  {
    title: "Retention",
    body: "We retain enquiry information only for as long as reasonably needed to respond to and manage the enquiry, subject to applicable legal requirements.",
  },
  {
    title: "Correction and deletion requests",
    body: "You may contact us to request access to, correction of, or deletion of your information, subject to applicable legal requirements.",
  },
];

export default function PrivacyPage() {
  const config = getPublicConfig();
  return (
    <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url}>
      <article className="mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Privacy</p>
        <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 max-w-2xl leading-7 text-muted">This policy explains how {config.company_name} handles information submitted through this enquiry form.</p>

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
            For privacy questions or requests, contact us at {config.contact_email || config.contact_phone_display || config.website_url}.
          </p>
        </section>
      </article>
    </SiteChrome>
  );
}
