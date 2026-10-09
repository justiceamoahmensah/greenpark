# Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

The landing page and questionnaire work without Google credentials. A submission is confirmed only when a configured Google Sheet acknowledges the append. Missing or invalid credentials produce a visible retryable error and preserve the browser draft.

Run the checks:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Playwright covers 320, 375, 390, 768, 1024, and 1440 pixel viewport widths. Install its Chromium revision with `npx playwright install chromium` if prompted.

