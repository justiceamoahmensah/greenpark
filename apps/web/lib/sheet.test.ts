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
import { answersToSheetRow, headersMatch } from "./sheet";
import type { Answers, PublicConfig } from "./types";

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

const answers: Answers = {
  full_name: "  Ama Mensah  ",
  phone_number: "+442079460958",
  phone_country: "GB",
  email_address: " ama@example.com ",
  interested_in: "Greenpark Properties",
  preferred_development: "haven-gardens-adjiringanor",
  property_type: "2 Bedrooms",
  budget_usd: "$100,000 - $200,000",
  purchase_timeline: "Within 6 Months",
  assistance_needed: "Payment Plan",
  contact_preference: "WhatsApp",
  additional_enquiry: "  Please share details.  ",
  may_we_contact_you: "No",
};

describe("Google Sheet contract", () => {
  it("keeps the exact 12 headings and order", () => {
    expect(SHEET_HEADERS).toHaveLength(12);
    expect(SHEET_HEADERS).toEqual([
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
    ]);
    expect(headersMatch([...SHEET_HEADERS])).toBe(true);
    expect(headersMatch([...SHEET_HEADERS, "Timestamp"])).toBe(false);
  });

  it("maps a validated enquiry into exactly twelve display values", () => {
    const row = answersToSheetRow(config, answers);
    expect(row).toHaveLength(12);
    expect(row[0]).toBe("Ama Mensah");
    expect(row[1]).toBe("+442079460958");
    expect(row[4]).toBe("Haven Gardens - Adjiringanor");
    expect(row[10]).toBe("Please share details.");
    expect(row[11]).toBe("No");
  });
});
