import { expect, test, type Page } from "@playwright/test";

const config = {
  company_name: "Greenpark Properties",
  placeholder_brand: false,
  contact_email: "",
  contact_phone_display: "+233 50 156 4792 · +233 50 162 0998",
  website_url: "https://www.greenparkproperties.com",
  whatsapp_url: "https://wa.me/442071838750?text=Hello",
  sheet_headers: [
    "Full Name", "WhatsApp / Phone Number", "Email Address", "Interested In", "Preferred Development",
    "Property Type", "Budget (USD)", "Purchase Timeline", "Assistance Needed", "Contact Preference",
    "Additional Enquiry", "May We Contact You?",
  ],
  interested_in: ["Greenpark Properties", "Whitehall Properties", "Both"],
  property_types: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "Townhouse", "Not Sure / Other"],
  budget_ranges: ["Below $100,000", "$100,000 - $200,000", "$200,001 - $300,000", "$300,001 - $500,000", "Above $500,000", "Prefer to discuss"],
  purchase_timelines: ["Immediately", "Within 3 Months", "Within 6 Months", "Within 12 Months", "Just Exploring"],
  assistance_needed: ["Property Details", "Payment Plan", "Arrange Site Visit", "Speak to Sales", "Investment Information", "Other"],
  contact_preferences: ["WhatsApp", "Phone Call", "Email"],
  consent: ["Yes", "No"],
  constraints: { full_name_min: 2, full_name_max: 100, additional_enquiry_max: 1000, email_max: 254 },
  developments: [
    {
      slug: "haven-gardens-adjiringanor", name: "Haven Gardens - Adjiringanor", description: "Haven Gardens development in Adjiringanor.",
      image_url: "/developments/development-a.svg", active: true, sample: true, selectable: true, qr_enabled: true,
      property_types: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "Townhouse", "Not Sure / Other"],
    },
    {
      slug: "cherrys-green-achimota", name: "Cherry's Green - Achimota", description: "Cherry's Green development in Achimota.",
      image_url: "/developments/development-b.svg", active: true, sample: false, selectable: true, qr_enabled: true,
      property_types: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "Townhouse", "Not Sure / Other"],
    },
    {
      slug: "whitehall-development", name: "Whitehall Development", description: "Whitehall property development.",
      image_url: "/developments/development-c.svg", active: true, sample: true, selectable: true, qr_enabled: true,
      property_types: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "Townhouse", "Not Sure / Other"],
    },
    {
      slug: "not-sure-need-advice", name: "Not Sure / Need Advice", description: "No development chosen.",
      image_url: "/developments/general.svg", active: true, sample: false, selectable: true, qr_enabled: false,
      property_types: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "Townhouse", "Not Sure / Other"],
    },
  ],
};

async function mockApi(page: Page, fail = false) {
  await page.route("**/api/config", (route) => route.fulfill({ json: config }));
  await page.route("**/api/enquiries", async (route) => {
    if (fail) {
      await route.fulfill({ status: 503, json: { message: "We could not securely save your enquiry." } });
      return;
    }
    await route.fulfill({
      status: 201,
      json: {
        acknowledged: true,
        whatsapp_url: "https://wa.me/442071838750?text=Hello",
        first_name: "Ama",
        may_we_contact_you: "No",
        acknowledged_at: "2026-10-09T12:00:00.000Z",
      },
    });
  });
}

async function complete(page: Page) {
  await page.getByTestId("full_name").fill("Ama Mensah");
  await page.getByTestId("continue").click();
  await page.getByTestId("phone-number").fill("+442079460958");
  await page.getByTestId("continue").click();
  await page.getByTestId("email_address").fill("not-an-email");
  await page.getByTestId("continue").click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByTestId("email_address").fill("ama@example.com");
  await page.getByTestId("continue").click();
  await page.getByText("Greenpark Properties", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByText("Haven Gardens - Adjiringanor", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByText("2 Bedrooms", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByText("Below $100,000", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByText("Just Exploring", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByText("Payment Plan", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByText("Email", { exact: true }).click();
  await page.getByTestId("continue").click();
  await page.getByTestId("skip").click();
  await page.getByText("No", { exact: true }).click();
  await page.getByTestId("continue").click();
  await expect(page).toHaveURL(/\/enquire\/review/);
  await expect(page.getByTestId("review")).toContainText("Ama Mensah");
}

test("development QR opens a validated development landing page", async ({ page }) => {
  await mockApi(page);
  await page.goto("/?development=haven-gardens-adjiringanor");
  await expect(page.getByRole("heading", { name: "Exploring Haven Gardens - Adjiringanor" })).toBeVisible();
  await expect(page.getByRole("link", { name: /start my enquiry/i })).toHaveAttribute("href", "/enquire?development=haven-gardens-adjiringanor");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("customer can review, recover from a failed save, and only then see success", async ({ page }) => {
  await mockApi(page, true);
  await page.goto("/enquire");
  await complete(page);
  await page.getByTestId("submit").click();
  await expect(page.getByText("We could not securely save your enquiry.")).toBeVisible();
  await expect(page).toHaveURL(/\/enquire\/review/);

  await page.unroute("**/api/enquiries");
  let posts = 0;
  await page.route("**/api/enquiries", async (route) => {
    posts += 1;
    await route.fulfill({
      status: 201,
      json: {
        acknowledged: true,
        whatsapp_url: "https://wa.me/442071838750?text=Hello",
        first_name: "Ama",
        may_we_contact_you: "No",
        acknowledged_at: "2026-10-09T12:00:00.000Z",
      },
    });
  });
  await page.getByTestId("submit").dblclick();
  await expect(page).toHaveURL(/\/enquire\/success/);
  await expect(page.getByTestId("success")).toContainText("Your enquiry has been received");
  await expect(page.getByTestId("success")).toContainText("preference not to be contacted");
  expect(posts).toBe(1);
});

test("draft survives refresh and reduced motion still advances", async ({ page }) => {
  await mockApi(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/enquire");
  await page.getByTestId("full_name").fill("Kwame Boateng");
  await page.reload();
  await expect(page.getByTestId("full_name")).toHaveValue("Kwame Boateng");
  await page.getByTestId("continue").click();
  await expect(page.getByRole("heading", { name: /phone number/i })).toBeVisible();
});

test("success URL alone cannot forge a confirmation", async ({ page }) => {
  await mockApi(page);
  await page.goto("/enquire/success?success=true");
  await expect(page.getByRole("heading", { name: "No confirmed submission found" })).toBeVisible();
});
