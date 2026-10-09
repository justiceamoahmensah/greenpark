# Netlify deployment

This application deploys as one Netlify site from the GitHub repository. The
root-level `netlify.toml` sets `apps/web` as the base directory, configures the
Next.js build output, and explicitly enables Netlify's Next.js runtime adapter.

1. Import the repository into Netlify, or connect the existing Netlify site to it.
2. Keep the build settings from `netlify.toml`.
3. Add every required value from `apps/web/.env.example` under **Project
   configuration > Environment variables**.
4. Set `PUBLIC_BASE_URL` to the canonical HTTPS site origin.
5. Set `GOOGLE_SERVICE_ACCOUNT_JSON` to the complete service-account JSON.
   Do not use the local `GOOGLE_APPLICATION_CREDENTIALS` file path on Netlify.
6. Deploy, then submit a test enquiry to a non-production Sheet.

The Google service account needs edit access only to the intended spreadsheet.
The JSON/private key is used exclusively by the server-side Route Handler and
must remain a Netlify secret. Never commit it to GitHub.

Generate production QR assets after the final domain is known:

```bash
cd apps/web
PUBLIC_BASE_URL=https://property.example.com npm run generate:qrs
```

The command creates a general QR code and validated development QR codes under `public/qr/`. Regenerate them whenever the canonical origin changes.

Before launch, replace all placeholder branding and catalogue content, supply licensed imagery, configure WhatsApp, and obtain legal approval for the privacy notice and retention process.
