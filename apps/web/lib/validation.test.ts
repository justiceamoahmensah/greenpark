import { describe, expect, it } from "vitest";
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
import type { PublicConfig } from "./types";
import { emptyAnswers } from "./types";
import { buildEnquirySchema, clearStalePropertyType, fieldError, normalizePhone, validName } from "./validation";

const config: PublicConfig = {
  company_name: "Test",
  placeholder_brand: true,
  contact_email: "info@greenparkproperties.com",
  contact_phone_display: "",
  website_url: "https://www.greenparkproperties.com",
  whatsapp_url: null,
  sheet_headers: [...SHEET_HEADERS],
  interested_in: [...INTERESTED_IN],
  property_types: [...PROPERTY_TYPES],
  budget_ranges: [...BUDGET_RANGES],
  purchase_timelines: [...PURCHASE_TIMELINES],
  assistance_needed: [...ASSISTANCE_NEEDED],
  contact_preferences: [...CONTACT_PREFERENCES],
  consent: [...CONSENT_OPTIONS],
  constraints: { ...CONSTRAINTS },
  developments: DEVELOPMENTS,
};

describe("enquiry validation", () => {
  it("accepts international names and rejects symbols", () => {
    expect(validName("José Álvarez")).toBe(true);
    expect(validName("李伟")).toBe(true);
    expect(validName("A")).toBe(false);
    expect(validName("=cmd")).toBe(false);
  });

  it("normalizes international phone numbers", () => {
    expect(normalizePhone("+442079460958", "")).toMatch(/^\+44/);
    expect(normalizePhone("123", "US")).toBeNull();
    expect(normalizePhone("not a phone", "")).toBeNull();
  });

  it("rejects an invalid email", () => {
    const answers = emptyAnswers();
    answers.email_address = "not-an-email";
    expect(fieldError(config, "email_address", answers)).toMatch(/email/i);
  });

  it("requires an explicit consent choice", () => {
    const answers = emptyAnswers();
    expect(fieldError(config, "may_we_contact_you", answers)).toBeTruthy();
    answers.may_we_contact_you = "No";
    expect(fieldError(config, "may_we_contact_you", answers)).toBeNull();
  });

  it("clears a property type the new development does not offer", () => {
    const answers = emptyAnswers();
    const restrictedConfig = {
      ...config,
      developments: config.developments.map((development) =>
        development.slug === "whitehall-development"
          ? { ...development, property_types: ["1 Bedroom"] }
          : development,
      ),
    };
    answers.preferred_development = "whitehall-development";
    answers.property_type = "Townhouse";
    expect(clearStalePropertyType(restrictedConfig, answers).property_type).toBe("");
  });

  it("keeps assistance as one sheet value", () => {
    const answers = {
      ...emptyAnswers(),
      full_name: "Ama Mensah",
      phone_number: "+442079460958",
      email_address: "ama@example.com",
      interested_in: "Both",
      preferred_development: "haven-gardens-adjiringanor",
      property_type: "2 Bedrooms",
      budget_usd: "Below $100,000",
      purchase_timeline: "Just Exploring",
      assistance_needed: "Investment Information",
      contact_preference: "Email",
      may_we_contact_you: "Yes" as const,
    };
    const parsed = buildEnquirySchema(config).safeParse(answers);
    expect(parsed.success).toBe(true);
    expect(answers.assistance_needed).toBe("Investment Information");
    expect(config.sheet_headers).toHaveLength(12);
    expect(config.sheet_headers[11]).toBe("May We Contact You?");
  });
});
