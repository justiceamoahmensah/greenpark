// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { appendEnquiryToSheet } = vi.hoisted(() => ({ appendEnquiryToSheet: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/google-sheets", () => ({
  appendEnquiryToSheet,
  SheetsConfigurationError: class SheetsConfigurationError extends Error {},
}));

import { POST } from "./route";

const validBody = {
  full_name: "Ama Mensah",
  phone_number: "+442079460958",
  phone_country: "GB",
  email_address: "ama@example.com",
  interested_in: "Greenpark Properties",
  preferred_development: "haven-gardens-adjiringanor",
  property_type: "2 Bedrooms",
  budget_usd: "Below $100,000",
  purchase_timeline: "Just Exploring",
  assistance_needed: "Payment Plan",
  contact_preference: "Email",
  additional_enquiry: "",
  may_we_contact_you: "No",
  website: "",
};

function request(origin = "http://localhost:3000", ip = crypto.randomUUID()) {
  return new Request("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      Host: "localhost:3000",
      "X-Forwarded-For": ip,
    },
    body: JSON.stringify(validBody),
  });
}

describe("POST /api/enquiries", () => {
  beforeEach(() => {
    appendEnquiryToSheet.mockReset();
  });

  it("returns success only after the twelve-column Sheet append resolves", async () => {
    appendEnquiryToSheet.mockResolvedValue(undefined);
    const response = await POST(request());
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.acknowledged).toBe(true);
    expect(body.first_name).toBe("Ama");
    expect(body.may_we_contact_you).toBe("No");
    expect(appendEnquiryToSheet).toHaveBeenCalledOnce();
    expect(appendEnquiryToSheet.mock.calls[0][0]).toHaveLength(12);
  });

  it("rejects a cross-origin submission", async () => {
    const response = await POST(request("https://malicious.example"));
    expect(response.status).toBe(403);
    expect(appendEnquiryToSheet).not.toHaveBeenCalled();
  });

  it("accepts the equivalent localhost loopback address in development", async () => {
    appendEnquiryToSheet.mockResolvedValue(undefined);
    const response = await POST(request("http://127.0.0.1:3000"));

    expect(response.status).toBe(201);
    expect(appendEnquiryToSheet).toHaveBeenCalledOnce();
  });

  it("does not claim success when Google Sheets fails", async () => {
    appendEnquiryToSheet.mockRejectedValue(new Error("upstream unavailable"));
    const response = await POST(request());
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.acknowledged).not.toBe(true);
    expect(body.message).toMatch(/could not securely save/i);
  });
});
