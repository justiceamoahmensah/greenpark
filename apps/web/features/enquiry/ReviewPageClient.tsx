"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { EnquiryApiError, fetchConfig, submitEnquiry } from "@/lib/api";
import { clearDraft, readDraft, writeDraft, writeSuccess, type Draft } from "@/lib/draft";
import type { PublicConfig } from "@/lib/types";
import { buildEnquirySchema } from "@/lib/validation";
import { QUESTIONS } from "./questions";
import { ReviewPanel } from "./ReviewPanel";

export function ReviewPageClient() {
  const router = useRouter();
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    Promise.all([fetchConfig(), Promise.resolve(readDraft())])
      .then(([nextConfig, nextDraft]) => {
        setConfig(nextConfig);
        setDraft(nextDraft);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready || !config) {
    return (
      <SiteChrome companyName="Property enquiry">
        <div className="mx-auto max-w-3xl animate-pulse px-5 py-16"><div className="h-14 w-2/3 rounded-2xl bg-navy/10" /><div className="mt-8 h-64 rounded-3xl bg-white" /></div>
      </SiteChrome>
    );
  }

  const validation = draft ? buildEnquirySchema(config).safeParse(draft.answers) : null;
  if (!draft || !validation?.success) {
    return (
      <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url}>
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <h1 className="font-display text-5xl">Your enquiry is not ready to review</h1>
          <p className="mt-4 leading-relaxed text-muted">Complete the twelve questions first. Any saved answers in this browser session will still be available.</p>
          <Button type="button" className="mt-8" onClick={() => router.push("/enquire")}>Continue enquiry</Button>
        </div>
      </SiteChrome>
    );
  }

  async function handleSubmit() {
    if (!draft || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      const submission = await submitEnquiry(draft.answers);
      writeSuccess(submission);
      clearDraft();
      router.replace("/enquire/success");
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);
      setSubmitError(
        error instanceof EnquiryApiError
          ? error.message
          : "We could not reach the enquiry service. Your answers are still here—please try again.",
      );
    }
  }

  return (
    <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url} compact>
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <ReviewPanel
          config={config}
          answers={draft.answers}
          onEdit={(step) => {
            const next = { ...draft, step };
            setDraft(next);
            writeDraft(next);
            router.push(`/enquire?step=${step}&return=review`);
          }}
        />
        {submitError ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{submitError}</p> : null}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="secondary" onClick={() => router.push(`/enquire?step=${QUESTIONS.length - 1}`)}>
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting} data-testid="submit">
            {submitting ? "Submitting securely…" : "Submit Enquiry"} {!submitting ? <Send className="size-4" aria-hidden="true" /> : null}
          </Button>
        </div>
      </div>
    </SiteChrome>
  );
}
