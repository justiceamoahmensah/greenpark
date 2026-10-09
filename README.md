# Premium Real Estate QR Enquiry Platform

A mobile-first, single-application Next.js enquiry experience. Visitors arrive from a general or development QR code, answer exactly twelve guided questions, review their answers, and submit directly to Google Sheets. A voluntary WhatsApp link is offered after Google Sheets acknowledges the save.

## Architecture

- Next.js App Router, React, and strict TypeScript
- Next.js Node.js Route Handlers for server-side validation and Google Sheets writes
- Tailwind CSS and shadcn-style reusable UI components
- Motion for React, React Hook Form, Zod, Lucide React, and libphonenumber-js
- Official Google Sheets API with server-side service-account credentials
- Browser `sessionStorage` for temporary draft and success-state recovery only
- Vitest, React Testing Library, and Playwright

Google Sheets is the MVP's only persistent server-side lead store. There is no separate backend, database, worker, or continuously running process.

## Local setup

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site and API Route Handlers run together.

Submissions deliberately return an error until valid Google credentials and a correctly headed sheet are configured. See [docs/google-sheets.md](docs/google-sheets.md).

Submitted rows can be viewed through the protected, unlinked `/internal/enquiries`
dashboard after configuring `ADMIN_USERNAME` and `ADMIN_PASSWORD`. See
[docs/internal-dashboard.md](docs/internal-dashboard.md).

## Commands

```bash
cd apps/web
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
PUBLIC_BASE_URL=https://example.com npm run generate:qrs
```

## Deploy

Create one Vercel project with **Root Directory** set to `apps/web`, add the server-only environment variables documented in [apps/web/.env.example](apps/web/.env.example), and deploy. See [docs/deployment.md](docs/deployment.md).

## Before production

- Replace the generated sample hero image with approved Greenpark campaign photography.
- Supply licensed business photography and verify its alt text.
- Configure and share the Google Sheet with the service account.
- Add the approved WhatsApp business number and contact details.
- Have counsel approve the privacy notice, lawful basis, retention period, and request process.
- Review access to the Google Sheet and rotate credentials according to company policy.
