import { FIELD_LABELS, QUESTIONS, REVIEW_GROUPS } from "@/features/enquiry/questions";
import type { Answers, PublicConfig } from "@/lib/types";
import { normalizePhone } from "@/lib/validation";

export function displayAnswer(config: PublicConfig, key: keyof Answers, answers: Answers) {
  if (key === "preferred_development") {
    return config.developments.find((item) => item.slug === answers.preferred_development)?.name || "Not answered";
  }
  if (key === "phone_number") {
    return normalizePhone(answers.phone_number, answers.phone_country) || answers.phone_number || "Not answered";
  }
  if (key === "additional_enquiry") return answers.additional_enquiry.trim() || "None";
  const value = answers[key];
  return value || "Not answered";
}

export function ReviewPanel({
  config,
  answers,
  onEdit,
}: {
  config: PublicConfig;
  answers: Answers;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="grid gap-6" data-testid="review">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-gold">Review</p>
        <h1 className="mt-2 max-w-2xl font-display text-5xl leading-tight">Everything look right?</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Review each answer before submitting. Contact permission is separate: choosing No means the sales team
          should not begin a follow-up.
        </p>
      </div>
      {REVIEW_GROUPS.map((group) => (
        <section key={group.title} className="rounded-3xl border border-navy/8 bg-white p-5 shadow-[0_12px_35px_rgba(16,43,70,0.04)] sm:p-6">
          <h2 className="font-display text-2xl text-navy">{group.title}</h2>
          <dl className="mt-4 grid gap-4">
            {group.fields.map((field) => (
              <div key={field} className="flex items-start justify-between gap-4 border-t border-navy/7 pt-4 first:border-0 first:pt-0">
                <div>
                  <dt className="text-sm text-muted">{FIELD_LABELS[field]}</dt>
                  <dd className="mt-1 whitespace-pre-wrap">{displayAnswer(config, field, answers)}</dd>
                </div>
                <button
                  type="button"
                  className="rounded-full px-2 py-1 text-sm font-medium text-royal underline-offset-4 hover:bg-blue-50 hover:underline"
                  onClick={() => onEdit(QUESTIONS.findIndex((question) => question.name === field))}
                >
                  Edit
                </button>
              </div>
            ))}
          </dl>
        </section>
      ))}
      <p className="text-sm leading-relaxed text-muted">
        Your details are sent to Google Sheets only when you submit successfully. Submitting does not sign you up
        for unrelated marketing. Read the{" "}
        <a className="text-navy underline" href="/privacy">
          privacy policy
        </a>
        . The template requires legal and business approval before production.
      </p>
    </div>
  );
}
