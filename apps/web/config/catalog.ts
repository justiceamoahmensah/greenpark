import type { Development } from "@/lib/types";

export const SHEET_HEADERS = [
  "Full Name",
  "WhatsApp / Phone Number",
  "Email Address",
  "Interested In",
  "Preferred Development",
  "Property Type",
  "Budget (USD)",
  "Purchase Timeline",
  "Assistance Needed",
  "Contact Preference",
  "Additional Enquiry",
  "May We Contact You?",
] as const;

export const INTERESTED_IN = [
  "Greenpark Properties",
  "Whitehall Properties",
  "Both",
] as const;

export const PROPERTY_TYPES = [
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4 Bedrooms",
  "Townhouse",
  "Not Sure / Other",
] as const;

export const BUDGET_RANGES = [
  "Below $100,000",
  "$100,000 - $200,000",
  "$200,001 - $300,000",
  "$300,001 - $500,000",
  "Above $500,000",
  "Prefer to discuss",
] as const;

export const PURCHASE_TIMELINES = [
  "Immediately",
  "Within 3 Months",
  "Within 6 Months",
  "Within 12 Months",
  "Just Exploring",
] as const;

export const ASSISTANCE_NEEDED = [
  "Property Details",
  "Payment Plan",
  "Arrange Site Visit",
  "Speak to Sales",
  "Investment Information",
  "Other",
] as const;

export const CONTACT_PREFERENCES = ["WhatsApp", "Phone Call", "Email"] as const;
export const CONSENT_OPTIONS = ["Yes", "No"] as const;

const allPropertyTypes = [...PROPERTY_TYPES];
const cherryPropertyTypes = ["1 Bedroom", "2 Bedrooms", "Townhouse", "Not Sure / Other"];

export const DEVELOPMENTS: Development[] = [
  {
    slug: "haven-gardens-adjiringanor",
    name: "Haven Gardens - Adjiringanor",
    description: "Apartments, penthouses and townhouses in Adjiringanor, Accra.",
    image_url: "/developments/development-a.svg",
    active: true,
    sample: false,
    selectable: true,
    qr_enabled: true,
    property_types: allPropertyTypes,
  },
  {
    slug: "cherrys-green-achimota",
    name: "Cherry's Green - Achimota",
    description: "One- and two-bedroom apartments and townhouses in Achimota, Accra.",
    image_url: "/developments/development-b.svg",
    active: true,
    sample: false,
    selectable: true,
    qr_enabled: true,
    property_types: cherryPropertyTypes,
  },
  {
    slug: "whitehall-development",
    name: "Whitehall Development",
    description: "Selected Whitehall partner developments across Accra.",
    image_url: "/developments/development-c.svg",
    active: true,
    sample: false,
    selectable: true,
    qr_enabled: true,
    property_types: allPropertyTypes,
  },
  {
    slug: "not-sure-need-advice",
    name: "Not Sure / Need Advice",
    description: "Choose this if you would like the sales team to help narrow down the options.",
    image_url: "/developments/general.svg",
    active: true,
    sample: false,
    selectable: true,
    qr_enabled: false,
    property_types: allPropertyTypes,
  },
];

export const CONSTRAINTS = {
  full_name_min: 2,
  full_name_max: 100,
  additional_enquiry_max: 1000,
  email_max: 254,
} as const;
