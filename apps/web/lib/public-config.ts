import "server-only";

import {
  ASSISTANCE_NEEDED,
  BUDGET_RANGES,
  CONSENT_OPTIONS,
  CONTACT_PREFERENCES,
  CONSTRAINTS,
  DEVELOPMENTS,
  INTERESTED_IN,
  PROPERTY_TYPES,
  PURCHASE_TIMELINES,
  SHEET_HEADERS,
} from "@/config/catalog";
import type { PublicConfig } from "@/lib/types";

export function whatsappUrl(
  message = "Hello Greenpark Properties, I am interested in learning more about your available properties. Please assist me.",
) {
  const phone = (process.env.WHATSAPP_E164 || "").replace(/[^\d]/g, "");
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;
}

export function getPublicConfig(): PublicConfig {
  return {
    company_name: process.env.COMPANY_NAME || "Greenpark Properties",
    placeholder_brand: process.env.COMPANY_PLACEHOLDER !== "false",
    contact_email: process.env.CONTACT_EMAIL?.trim() || "",
    contact_phone_display: process.env.CONTACT_PHONE_DISPLAY || "",
    website_url: process.env.WEBSITE_URL || "https://www.greenparkproperties.com",
    whatsapp_url: whatsappUrl(),
    sheet_headers: [...SHEET_HEADERS],
    interested_in: [...INTERESTED_IN],
    property_types: [...PROPERTY_TYPES],
    budget_ranges: [...BUDGET_RANGES],
    purchase_timelines: [...PURCHASE_TIMELINES],
    assistance_needed: [...ASSISTANCE_NEEDED],
    contact_preferences: [...CONTACT_PREFERENCES],
    consent: [...CONSENT_OPTIONS],
    constraints: { ...CONSTRAINTS },
    developments: DEVELOPMENTS.filter((item) => item.active),
  };
}
