# Vercel deployment

This application deploys as one Vercel project.

1. Import the repository into Vercel.
2. Set **Root Directory** to `apps/web`.
3. Keep the detected Next.js framework preset.
4. Add every required value from `.env.example` as an environment variable.
5. Set `PUBLIC_BASE_URL` to the canonical HTTPS site origin.
6. Deploy, then submit a test enquiry to a non-production Sheet.

The Google service account needs edit access only to the intended spreadsheet. The JSON/private key is used exclusively by the Node.js Route Handler and must remain a Vercel secret.

Generate production QR assets after the final domain is known:

```bash
cd apps/web
PUBLIC_BASE_URL=https://property.example.com npm run generate:qrs
```

The command creates a general QR code and validated development QR codes under `public/qr/`. Regenerate them whenever the canonical origin changes.

Before launch, replace all placeholder branding and catalogue content, supply licensed imagery, configure WhatsApp, and obtain legal approval for the privacy notice and retention process.

