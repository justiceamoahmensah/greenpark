"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type Ref } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { fetchConfig } from "@/lib/api";
import { clearDraft, newDraft, readDraft, writeDraft, type Draft } from "@/lib/draft";
import type { Answers, PublicConfig } from "@/lib/types";
import { emptyAnswers } from "@/lib/types";
import { clearStalePropertyType, fieldError } from "@/lib/validation";
import { PhoneField } from "./PhoneField";
import { QUESTIONS, propertyOptions } from "./questions";
import { SelectionCards } from "./SelectionCards";

export function EnquiryFlow({
  developmentSlug,
  requestedStep,
  returnToReview,
}: {
  developmentSlug: string | null;
  requestedStep: number | null;
  returnToReview: boolean;
}) {
  const router = useRouter();
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loadError, setLoadError] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const reduceMotion = useReducedMotion();
  const form = useForm<Answers>({ defaultValues: emptyAnswers(), mode: "onChange" });

  useEffect(() => {
    let active = true;
    fetchConfig()
      .then((nextConfig) => {
        if (!active) return;
        const stored = readDraft();
        const initial = stored ?? newDraft(developmentSlug);
        const development = nextConfig.developments.find(
          (item) => item.slug === developmentSlug && item.qr_enabled,
        );
        if (!stored && development) initial.answers.preferred_development = development.slug;
        if (requestedStep !== null) initial.step = Math.min(Math.max(requestedStep, 0), QUESTIONS.length - 1);
        setConfig(nextConfig);
        setDraft(initial);
        form.reset(initial.answers);
        writeDraft(initial);
      })
      .catch(() => {
        if (active) setLoadError("The enquiry service is unavailable right now. Please try again shortly.");
      });
    return () => {
      active = false;
    };
  }, [developmentSlug, form, requestedStep]);

  const answers = useWatch({ control: form.control }) as Answers;
  const currentStep = draft?.step;

  useEffect(() => {
    if (!draft) return;
    writeDraft({ ...draft, answers: form.getValues() });
  }, [answers, draft, form]);

  useEffect(() => {
    if (currentStep === undefined) return;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    const timer = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(timer);
  }, [currentStep, reduceMotion]);

  if (loadError) {
    return (
      <SiteChrome companyName="Property enquiry">
        <div className="mx-auto max-w-2xl px-5 py-24 text-center" role="alert">
          <h1 className="font-display text-4xl">We could not prepare the enquiry</h1>
          <p className="mt-4 text-muted">{loadError}</p>
        </div>
      </SiteChrome>
    );
  }

  if (!config || !draft) {
    return (
      <SiteChrome companyName="Property enquiry">
        <div className="mx-auto max-w-3xl animate-pulse px-5 py-16" aria-label="Preparing the enquiry">
          <div className="h-2 rounded-full bg-navy/10" />
          <div className="mt-12 h-12 w-4/5 rounded-xl bg-navy/10" />
          <div className="mt-8 h-48 rounded-3xl bg-white" />
        </div>
      </SiteChrome>
    );
  }

  const question = QUESTIONS[draft.step];
  const currentError = fieldError(config, question.name, answers);
  const options =
    question.name === "property_type"
      ? propertyOptions(config, answers.preferred_development)
      : question.options?.(config) || [];

  function update(partial: Partial<Answers>) {
    const next = clearStalePropertyType(config!, { ...form.getValues(), ...partial });
    (Object.keys(next) as (keyof Answers)[]).forEach((key) => form.setValue(key, next[key]));
    setDraft((current) => (current ? { ...current, answers: next } : current));
    setAttempted(false);
  }

  function goNext() {
    if (!draft || !config) return;
    const error = fieldError(config, question.name, form.getValues());
    if (error) {
      setAttempted(true);
      return;
    }
    const current = { ...draft, answers: form.getValues() };
    setAttempted(false);
    if (returnToReview || draft.step === QUESTIONS.length - 1) {
      writeDraft(current);
      router.push("/enquire/review");
      return;
    }
    const next = { ...current, step: draft.step + 1 };
    setDraft(next);
    writeDraft(next);
  }

  function goBack() {
    if (!draft) return;
    setAttempted(false);
    if (returnToReview) {
      router.push("/enquire/review");
      return;
    }
    if (draft.step === 0) {
      router.push("/");
      return;
    }
    const next = { ...draft, step: draft.step - 1, answers: form.getValues() };
    setDraft(next);
    writeDraft(next);
  }

  function skip() {
    setAttempted(false);
    form.setValue("additional_enquiry", "");
    const next = { ...draft!, answers: { ...form.getValues(), additional_enquiry: "" } };
    writeDraft(next);
    if (returnToReview) router.push("/enquire/review");
    else setDraft({ ...next, step: Math.min(draft!.step + 1, QUESTIONS.length - 1) });
  }

  function restart() {
    clearDraft();
    const fresh = newDraft(developmentSlug);
    const development = config!.developments.find((item) => item.slug === developmentSlug && item.qr_enabled);
    if (development) fresh.answers.preferred_development = development.slug;
    form.reset(fresh.answers);
    setDraft(fresh);
    writeDraft(fresh);
    setConfirmReset(false);
  }

  return (
    <SiteChrome companyName={config.company_name} email={config.contact_email} phone={config.contact_phone_display} website={config.website_url} compact>
      <div className="mx-auto w-full max-w-3xl px-5 pb-32 pt-5 sm:px-8 md:pb-16 md:pt-10">
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <span>{question.section}</span>
            <span>{draft.step + 1} / {QUESTIONS.length}</span>
          </div>
          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-navy/10"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={draft.step + 1}
            aria-label={`Question ${draft.step + 1} of ${QUESTIONS.length}`}
          >
            <motion.div
              className="h-full rounded-full bg-gold"
              initial={false}
              animate={{ width: `${((draft.step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            />
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            goNext();
          }}
          noValidate
        >
          <AnimatePresence mode="wait">
            <motion.section
              key={question.name}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              aria-labelledby="question-title"
            >
              <p className="text-sm font-medium text-gold">A quick question</p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] outline-none sm:text-5xl"
                id="question-title"
              >
                {question.prompt}
              </h1>
              {question.description ? <p className="mt-4 max-w-2xl leading-relaxed text-muted">{question.description}</p> : null}

              <div className="mt-8">
                {question.kind === "text" || question.kind === "email" ? (
                  <label className="grid gap-2 text-sm font-medium" htmlFor={question.name}>
                    {question.sheetLabel}
                    <input
                      id={question.name}
                      ref={inputRef as Ref<HTMLInputElement>}
                      className="min-h-14 w-full rounded-2xl border border-navy/15 bg-white px-5 py-3 text-lg shadow-sm transition focus:border-royal"
                      value={answers[question.name]}
                      onChange={(event) => update({ [question.name]: event.target.value })}
                      autoComplete={question.kind === "email" ? "email" : "name"}
                      inputMode={question.kind === "email" ? "email" : "text"}
                      maxLength={question.kind === "email" ? config.constraints.email_max : config.constraints.full_name_max}
                      aria-invalid={attempted && Boolean(currentError)}
                      aria-describedby={attempted && currentError ? "question-error" : undefined}
                      data-testid={question.name}
                    />
                  </label>
                ) : null}

                {question.kind === "phone" ? (
                  <PhoneField
                    country={answers.phone_country}
                    number={answers.phone_number}
                    onCountry={(value) => update({ phone_country: value })}
                    onNumber={(value) => update({ phone_number: value })}
                    inputRef={inputRef as Ref<HTMLInputElement>}
                    invalid={attempted && Boolean(currentError)}
                  />
                ) : null}

                {question.kind === "cards" || question.kind === "consent" ? (
                  <SelectionCards
                    name={question.name}
                    label={question.prompt}
                    options={options}
                    value={answers[question.name]}
                    onChange={(value) => update({ [question.name]: String(value) })}
                    mode="single"
                  />
                ) : null}

                {question.kind === "textarea" ? (
                  <div>
                    <label className="sr-only" htmlFor="additional-enquiry">Additional enquiry</label>
                    <textarea
                      id="additional-enquiry"
                      ref={inputRef as Ref<HTMLTextAreaElement>}
                      className="min-h-40 w-full resize-y rounded-2xl border border-navy/15 bg-white px-5 py-4 text-base shadow-sm focus:border-royal"
                      value={answers.additional_enquiry}
                      maxLength={config.constraints.additional_enquiry_max}
                      onChange={(event) => update({ additional_enquiry: event.target.value })}
                      data-testid="additional-enquiry"
                    />
                    <p className="mt-2 text-right text-sm text-muted" aria-live="polite">
                      {answers.additional_enquiry.length} / {config.constraints.additional_enquiry_max}
                    </p>
                  </div>
                ) : null}
              </div>

              {attempted && currentError ? (
                <p id="question-error" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                  {currentError}
                </p>
              ) : null}
            </motion.section>
          </AnimatePresence>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-ivory/95 px-5 py-4 backdrop-blur-xl md:static md:mt-10 md:border-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
              <Button type="button" variant="secondary" onClick={goBack}>
                <ArrowLeft aria-hidden="true" className="size-4" /> Back
              </Button>
              <div className="flex items-center gap-2">
                {!question.required ? (
                  <Button type="button" variant="ghost" data-testid="skip" onClick={skip}>Skip</Button>
                ) : null}
                <Button type="submit" data-testid="continue">
                  {returnToReview ? "Return to review" : "Continue"} <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>

        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted underline decoration-gold underline-offset-4"
          onClick={() => setConfirmReset(true)}
        >
          <RotateCcw aria-hidden="true" className="size-4" /> Start over
        </button>
      </div>

      {confirmReset ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="w-full max-w-md rounded-3xl bg-ivory p-7 shadow-2xl">
            <h2 id="reset-title" className="font-display text-3xl">Start over?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">This clears every answer saved in this browser session.</p>
            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setConfirmReset(false)} autoFocus>Cancel</Button>
              <Button type="button" onClick={restart}>Start over</Button>
            </div>
          </div>
        </div>
      ) : null}
    </SiteChrome>
  );
}
