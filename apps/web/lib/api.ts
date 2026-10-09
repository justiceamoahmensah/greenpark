import type { Answers, PublicConfig, Submission } from "./types";
import { normalizeEmail, normalizeName, normalizePhone } from "./validation";

export class EnquiryApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export async function fetchConfig(): Promise<PublicConfig> {
  const response = await fetch("/api/config", { cache: "no-store" });
  if (!response.ok) {
    throw new EnquiryApiError(response.status, "The enquiry service is unavailable right now.");
  }
  return response.json();
}

export async function submitEnquiry(answers: Answers) {
  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...answers,
      full_name: normalizeName(answers.full_name),
      phone_number: normalizePhone(answers.phone_number, answers.phone_country) ?? answers.phone_number,
      email_address: normalizeEmail(answers.email_address),
      additional_enquiry: answers.additional_enquiry.trim(),
      website: "",
    }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new EnquiryApiError(
      response.status,
      data?.message || "We could not submit this enquiry. Your answers are still here.",
      data?.fields || {},
    );
  }
  const submission = {
    acknowledged: true as const,
    whatsapp_url: data.whatsapp_url,
    first_name: data.first_name,
    may_we_contact_you: data.may_we_contact_you,
    acknowledged_at: data.acknowledged_at,
  } satisfies Submission;
  return submission;
}
