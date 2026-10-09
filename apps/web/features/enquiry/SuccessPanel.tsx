import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Submission } from "@/lib/types";

export function SuccessPanel({ submission }: { submission: Submission }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 md:py-24" data-testid="success">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-navy text-white shadow-[0_18px_45px_rgba(16,43,70,0.2)]">
        <Check className="size-9" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-gold">Enquiry received</p>
      <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">
        Thank you{submission.first_name ? `, ${submission.first_name}` : ""}.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
        Google Sheets acknowledged your enquiry. The property team can now review the details you provided.
      </p>

      <div className="mx-auto mt-9 max-w-lg rounded-3xl border border-navy/8 bg-white p-6 text-left shadow-[0_14px_40px_rgba(16,43,70,0.06)]">
        <h2 className="font-display text-2xl">What happens next</h2>
        {submission.may_we_contact_you === "No" ? (
          <p className="mt-3 text-sm leading-6 text-muted">
            You asked the sales team not to contact you, so they should not begin a follow-up. You may still start a
            conversation yourself using the optional WhatsApp link below.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted">
            The sales team may follow up about this enquiry using the contact method you selected. No response time
            is guaranteed.
          </p>
        )}
      </div>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        {submission.whatsapp_url ? (
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-royal" href={submission.whatsapp_url} data-testid="whatsapp-link">
            <MessageCircle className="size-4" aria-hidden="true" /> Chat With Sales
          </a>
        ) : null}
        <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:border-gold">
          Return to homepage <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
