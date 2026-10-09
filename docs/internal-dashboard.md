# Internal enquiry dashboard

The application exposes an unlinked, read-only dashboard at `/internal/enquiries`.
It reads the same 12 columns from the configured Google Sheet; it does not create a
second database or copy lead data into the browser beyond the authenticated page.

## Authentication

Configure these server-only variables locally and in Vercel:

```text
ADMIN_USERNAME=your-private-username
ADMIN_PASSWORD=a-unique-password-with-at-least-16-characters
```

The route uses HTTP Basic Authentication, is excluded from public navigation, sends
`noindex`, `nofollow`, `noarchive`, and `private, no-store` response headers, and
rechecks authorization immediately before reading the Google Sheet.

Change the local temporary credentials before deployment. Never put them in a
`NEXT_PUBLIC_` variable or commit `.env.local`.

## Viewing submissions

1. Open `https://your-domain.example/internal/enquiries`.
2. Enter the configured username and password when the browser prompts.
3. Use **Refresh data** to retrieve the latest rows from the `Enquiries` tab.

The dashboard is unavailable when Google Sheets access, credentials, or the exact
12-column header contract is invalid.
