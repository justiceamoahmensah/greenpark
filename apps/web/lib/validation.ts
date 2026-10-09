import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { z } from "zod";
import type { Answers, PublicConfig } from "./types";

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validName(value: string, min = 2, max = 100) {
  const name = normalizeName(value);
  if (name.length < min || name.length > max) return false;
  if (![...name].some((character) => /\p{L}/u.test(character))) return false;
  return /^[\p{L} .'’-]+$/u.test(name);
}

export function normalizePhone(number: string, country: string) {
  const trimmed = number.trim();
  if (!trimmed) return null;
  const international = trimmed.startsWith("+")
    ? trimmed
    : trimmed.startsWith("00")
      ? `+${trimmed.slice(2)}`
      : "";
  const parsed = international
    ? parsePhoneNumberFromString(international)
    : country
      ? parsePhoneNumberFromString(trimmed, country as CountryCode)
      : undefined;
  if (!parsed?.isValid()) return null;
  return parsed.number;
}

export function normalizeEmail(value: string) {
  return value.trim();
}

export function clearStalePropertyType(config: PublicConfig, answers: Answers): Answers {
  const development = config.developments.find((item) => item.slug === answers.preferred_development);
  if (!development || !answers.property_type) return answers;
  if (development.property_types.includes(answers.property_type)) return answers;
  return { ...answers, property_type: "" };
}

export function fieldError(config: PublicConfig, name: keyof Answers, answers: Answers): string | null {
  const limits = config.constraints;
  switch (name) {
    case "full_name":
      return validName(answers.full_name, limits.full_name_min, limits.full_name_max)
        ? null
        : "Enter your full name using 2 to 100 characters.";
    case "phone_number":
    case "phone_country":
      return normalizePhone(answers.phone_number, answers.phone_country)
        ? null
        : "Enter a valid phone number, including the country code.";
    case "email_address": {
      const email = normalizeEmail(answers.email_address);
      const parsed = z.email().safeParse(email);
      if (!email || email.length > limits.email_max || !parsed.success) return "Enter a valid email address.";
      return null;
    }
    case "interested_in":
      return config.interested_in.includes(answers.interested_in) ? null : "Select what you are interested in.";
    case "preferred_development":
      return config.developments.some(
        (item) =>
          item.slug === answers.preferred_development && item.selectable !== false && item.active !== false,
      )
        ? null
        : "Select a development.";
    case "property_type": {
      const development = config.developments.find((item) => item.slug === answers.preferred_development);
      if (!development || !development.property_types.includes(answers.property_type)) {
        return "Select a property type available for this development.";
      }
      return null;
    }
    case "budget_usd":
      return config.budget_ranges.includes(answers.budget_usd) ? null : "Select an estimated budget range in USD.";
    case "purchase_timeline":
      return config.purchase_timelines.includes(answers.purchase_timeline) ? null : "Select a purchase timeline.";
    case "assistance_needed":
      return config.assistance_needed.includes(answers.assistance_needed)
        ? null
        : "Select how the property team can assist you.";
    case "contact_preference":
      return config.contact_preferences.includes(answers.contact_preference)
        ? null
        : "Select how you prefer to be contacted.";
    case "additional_enquiry":
      return answers.additional_enquiry.length > limits.additional_enquiry_max
        ? "Please keep this note within 1,000 characters."
        : null;
    case "may_we_contact_you":
      return answers.may_we_contact_you === "Yes" || answers.may_we_contact_you === "No"
        ? null
        : "Choose Yes or No so we know whether the sales team may contact you.";
    default:
      return null;
  }
}

export function buildEnquirySchema(config: PublicConfig) {
  return z
    .object({
      full_name: z.string(),
      phone_number: z.string(),
      phone_country: z.string(),
      email_address: z.string(),
      interested_in: z.string(),
      preferred_development: z.string(),
      property_type: z.string(),
      budget_usd: z.string(),
      purchase_timeline: z.string(),
      assistance_needed: z.string(),
      contact_preference: z.string(),
      additional_enquiry: z.string(),
      may_we_contact_you: z.string(),
    })
    .superRefine((value, context) => {
      const answers = value as Answers;
      (Object.keys(answers) as (keyof Answers)[]).forEach((key) => {
        if (key === "phone_country") return;
        const message = fieldError(config, key, answers);
        if (message) context.addIssue({ code: z.ZodIssueCode.custom, path: [key], message });
      });
    });
}
