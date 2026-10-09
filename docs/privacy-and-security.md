# Privacy and security notes

- The browser stores an unsubmitted draft in `sessionStorage`; it is cleared after a successful save or when the customer starts over.
- Google Sheets is the only persistent server-side lead store.
- Service-account credentials exist only in server environment variables.
- The submission Route Handler validates origin, content type, payload size, every field, option membership, development/property compatibility, phone normalization, and the exact Sheet headers.
- Sheet values use RAW input mode, and no customer data is written to logs.
- A preferred contact channel is not consent. `May We Contact You? = No` must prevent proactive sales follow-up.
- The optional WhatsApp link starts no message automatically; the customer decides whether to send.
- Security headers deny framing, MIME sniffing, camera, microphone, and geolocation access.

The privacy page is an editable template, not legal advice. Counsel must approve the operating company identity, jurisdiction-specific disclosures, lawful basis, retention period, access controls, and correction/deletion request process.
