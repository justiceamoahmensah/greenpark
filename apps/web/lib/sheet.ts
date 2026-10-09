import { SHEET_HEADERS } from "@/config/catalog";
import type { Answers, PublicConfig } from "@/lib/types";
import { normalizeEmail, normalizeName, normalizePhone } from "@/lib/validation";

export type SheetRow = [string, string, string, string, string, string, string, string, string, string, string, string];

export function answersToSheetRow(config: PublicConfig, answers: Answers): SheetRow {
  const development = config.developments.find((item) => item.slug === answers.preferred_development);
  const phone = normalizePhone(answers.phone_number, answers.phone_country);
  if (!development || !phone) throw new Error("Cannot map an invalid enquiry to Google Sheets.");

  return [
    normalizeName(answers.full_name),
    phone,
    normalizeEmail(answers.email_address),
    answers.interested_in,
    development.name,
    answers.property_type,
    answers.budget_usd,
    answers.purchase_timeline,
    answers.assistance_needed,
    answers.contact_preference,
    answers.additional_enquiry.trim(),
    answers.may_we_contact_you,
  ];
}

export function headersMatch(values: unknown): values is string[] {
  return Array.isArray(values) && values.length === SHEET_HEADERS.length && SHEET_HEADERS.every((value, index) => values[index] === value);
}

