# Architecture

The project contains one Next.js application in `apps/web`.

```text
Browser
  ├─ Landing, enquiry, review, success, privacy
  ├─ sessionStorage draft and acknowledged-success state
  └─ POST /api/enquiries
          ├─ same-origin and content checks
          ├─ rate limit and honeypot
          ├─ centralized Zod/business validation
          ├─ exact twelve-column mapping
          └─ Google Sheets API append using a service account
```

The success route does not trust a URL parameter. It renders confirmation only when the same browser session contains the response created after the Google append succeeds.

The in-memory rate limiter is a best-effort abuse control suitable for the MVP; serverless instances do not share its state. Stronger distributed limiting would require an external durable service, which is intentionally outside the no-external-database architecture.

