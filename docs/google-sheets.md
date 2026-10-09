# Google Sheets setup

1. Create a Google Cloud project and enable the Google Sheets API.
2. Create a service account and a JSON key.
3. Create a spreadsheet and name the destination tab `Enquiries`.
4. Put this exact header row in cells `A1:L1`:

```text
Full Name | WhatsApp / Phone Number | Email Address | Interested In | Preferred Development | Property Type | Budget (USD) | Purchase Timeline | Assistance Needed | Contact Preference | Additional Enquiry | May We Contact You?
```

5. Share the spreadsheet with the service-account email as an **Editor**.
6. Add these server-only variables to `apps/web/.env.local` and to Vercel:

```text
GOOGLE_SHEET_ID=the-id-from-the-sheet-url
GOOGLE_SHEET_TAB=Enquiries
GOOGLE_SERVICE_ACCOUNT_JSON={...the complete service-account JSON...}
```

Instead of the JSON variable, the app also accepts:

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

For local development, the downloaded key can remain outside the repository:

```text
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account-key.json
```

Use a secret environment variable rather than a filesystem path when deploying to
Vercel, because the local file will not exist in the deployment.

Never prefix credentials with `NEXT_PUBLIC_`, commit them, or expose them to the browser.

## Where to see submitted enquiries

Open the spreadsheet normally at `https://docs.google.com/spreadsheets/`. Select the
spreadsheet whose ID you configured in `GOOGLE_SHEET_ID`, then open the `Enquiries`
tab. Each successful form submission appears as a new row directly below the header.
The website does not include an admin/data-view page: access stays inside Google
Sheets and is controlled by the spreadsheet's Share settings.

The spreadsheet ID is the value between `/d/` and `/edit` in its URL. For example,
in `https://docs.google.com/spreadsheets/d/ABC123/edit`, the ID is `ABC123`.

After changing `.env.local`, restart `npm run dev`. For local testing, open the same
base URL configured in `PUBLIC_BASE_URL` (for example, `http://127.0.0.1:3000`). For
production, set `PUBLIC_BASE_URL` to the exact public HTTPS domain.

## Connection checklist

- The Google Sheets API is enabled in the service account's Google Cloud project.
- `GOOGLE_SHEET_ID` contains only the spreadsheet ID, not the full URL.
- The destination tab is named exactly like `GOOGLE_SHEET_TAB` (`Enquiries` by default).
- Cells `A1:L1` contain the exact header row above in the same order.
- The spreadsheet is shared with the service account's `client_email` as Editor.
- The JSON key is stored in one line as `GOOGLE_SERVICE_ACCOUNT_JSON`, or the email and private key variables are both present.
- Alternatively, local development points `GOOGLE_APPLICATION_CREDENTIALS` to a readable JSON key outside the repository.
- The Next.js server was restarted after the environment variables changed.

Before every append, the Route Handler verifies the exact 12-column heading contract. It appends with `valueInputOption=RAW`, adds no timestamp or metadata column, and reports success only after Google acknowledges the write.
