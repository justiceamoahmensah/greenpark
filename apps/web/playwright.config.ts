import { defineConfig } from "@playwright/test";

const chromium = { browserName: "chromium" as const };

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:3100", trace: "on-first-retry" },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "phone-320", use: { ...chromium, viewport: { width: 320, height: 700 } } },
    { name: "phone-375", use: { ...chromium, viewport: { width: 375, height: 812 } } },
    { name: "phone-390", use: { ...chromium, viewport: { width: 390, height: 844 } } },
    { name: "tablet", use: { ...chromium, viewport: { width: 768, height: 1024 } } },
    { name: "laptop", use: { ...chromium, viewport: { width: 1024, height: 768 } } },
    { name: "desktop", use: { ...chromium, viewport: { width: 1440, height: 900 } } },
  ],
});
