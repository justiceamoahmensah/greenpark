import type { Answers, PublicConfig } from "@/lib/types";

export type QuestionKind = "text" | "email" | "phone" | "cards" | "textarea" | "consent";

export type Question = {
  name: keyof Answers;
  sheetLabel: string;
  section: string;
  prompt: string;
  kind: QuestionKind;
  required: boolean;
  description?: string;
  options?: (config: PublicConfig) => { value: string; label: string; hint?: string }[];
};

export const QUESTIONS: Question[] = [
  {
    name: "full_name",
    sheetLabel: "Full Name",
    section: "About You",
    prompt: "May we have your full name, please?",
    kind: "text",
    required: true,
  },
  {
    name: "phone_number",
    sheetLabel: "WhatsApp / Phone Number",
    section: "About You",
    prompt: "What phone number should our property team use to reach you?",
    kind: "phone",
    required: true,
    description: "Use an international number, including the country code.",
  },
  {
    name: "email_address",
    sheetLabel: "Email Address",
    section: "About You",
    prompt: "What is your email address?",
    kind: "email",
    required: true,
  },
  {
    name: "interested_in",
    sheetLabel: "Interested In",
    section: "Property Interests",
    prompt: "What are you interested in?",
    kind: "cards",
    required: true,
    options: (config) => config.interested_in.map((value) => ({ value, label: value })),
  },
  {
    name: "preferred_development",
    sheetLabel: "Preferred Development",
    section: "Property Interests",
    prompt: "Which development interests you?",
    kind: "cards",
    required: true,
    options: (config) =>
      config.developments
        .filter((item) => item.selectable)
        .map((item) => ({
          value: item.slug,
          label: item.name,
          hint: item.sample ? "Sample catalogue" : item.description,
        })),
  },
  {
    name: "property_type",
    sheetLabel: "Property Type",
    section: "Property Interests",
    prompt: "What type of property are you looking for?",
    kind: "cards",
    required: true,
    options: (config) => {
      const selected = config.developments.find((item) => item.selectable);
      const types = selected ? config.property_types : config.property_types;
      return types.map((value) => ({ value, label: value }));
    },
  },
  {
    name: "budget_usd",
    sheetLabel: "Budget (USD)",
    section: "Property Interests",
    prompt: "What is your estimated property budget in USD?",
    kind: "cards",
    required: true,
    description: "These sample ranges are illustrative and can be configured for the business.",
    options: (config) => config.budget_ranges.map((value) => ({ value, label: value })),
  },
  {
    name: "purchase_timeline",
    sheetLabel: "Purchase Timeline",
    section: "Your Plans",
    prompt: "When are you planning to purchase?",
    kind: "cards",
    required: true,
    options: (config) => config.purchase_timelines.map((value) => ({ value, label: value })),
  },
  {
    name: "assistance_needed",
    sheetLabel: "Assistance Needed",
    section: "Your Plans",
    prompt: "How can our sales team assist you?",
    kind: "cards",
    required: true,
    options: (config) => config.assistance_needed.map((value) => ({ value, label: value })),
  },
  {
    name: "contact_preference",
    sheetLabel: "Contact Preference",
    section: "Your Plans",
    prompt: "How would you prefer us to contact you?",
    kind: "cards",
    required: true,
    description: "Your preference does not grant permission for unsolicited messages.",
    options: (config) => config.contact_preferences.map((value) => ({ value, label: value })),
  },
  {
    name: "additional_enquiry",
    sheetLabel: "Additional Enquiry",
    section: "Final Details",
    prompt: "Is there anything else you would like us to know?",
    kind: "textarea",
    required: false,
  },
  {
    name: "may_we_contact_you",
    sheetLabel: "May We Contact You?",
    section: "Final Details",
    prompt: "May our sales team contact you about this enquiry using your preferred contact method?",
    kind: "consent",
    required: true,
    description: "Choose Yes or No. You may submit either way, and this is not broad marketing consent.",
    options: (config) => config.consent.map((value) => ({ value, label: value })),
  },
];

export function propertyOptions(config: PublicConfig, developmentSlug: string) {
  const development = config.developments.find((item) => item.slug === developmentSlug);
  const values = development?.property_types ?? config.property_types;
  return values.map((value) => ({ value, label: value }));
}

export const REVIEW_GROUPS = [
  { title: "About You", fields: ["full_name", "phone_number", "email_address"] as (keyof Answers)[] },
  {
    title: "Property Interests",
    fields: ["interested_in", "preferred_development", "property_type", "budget_usd"] as (keyof Answers)[],
  },
  {
    title: "Your Plans",
    fields: ["purchase_timeline", "assistance_needed", "contact_preference"] as (keyof Answers)[],
  },
  { title: "Final Details", fields: ["additional_enquiry", "may_we_contact_you"] as (keyof Answers)[] },
];

export const FIELD_LABELS: Record<keyof Answers, string> = {
  full_name: QUESTIONS[0].sheetLabel,
  phone_number: QUESTIONS[1].sheetLabel,
  phone_country: "Country",
  email_address: QUESTIONS[2].sheetLabel,
  interested_in: QUESTIONS[3].sheetLabel,
  preferred_development: QUESTIONS[4].sheetLabel,
  property_type: QUESTIONS[5].sheetLabel,
  budget_usd: QUESTIONS[6].sheetLabel,
  purchase_timeline: QUESTIONS[7].sheetLabel,
  assistance_needed: QUESTIONS[8].sheetLabel,
  contact_preference: QUESTIONS[9].sheetLabel,
  additional_enquiry: QUESTIONS[10].sheetLabel,
  may_we_contact_you: QUESTIONS[11].sheetLabel,
};
