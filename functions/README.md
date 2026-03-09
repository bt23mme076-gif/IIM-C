Cloud Function: newsletter_subscribers -> confirmation email

Overview
- This Cloud Function listens for new documents in the `newsletter_subscribers` Firestore collection and sends a confirmation email to the subscriber using SMTP (SendGrid/Gmail/etc).

Setup & Deploy
1) Install Firebase CLI (if not already):

```bash
npm install -g firebase-tools
firebase login
```

2) Initialize functions (if you haven't already). From the repo root run:

```bash
firebase init functions
# Choose JavaScript when asked
```

3) Configure SMTP credentials in Firebase functions config. Example for SendGrid (recommended):

```bash
firebase functions:config:set smtp.user="apikey" smtp.pass="YOUR_SENDGRID_API_KEY" smtp.host="smtp.sendgrid.net" smtp.port=587 smtp.secure=false site.from="Prof Name <no-reply@yourdomain.com>"
```

If you want to use Gmail (not recommended for production), set:

```bash
firebase functions:config:set smtp.user="your@gmail.com" smtp.pass="APP_PASSWORD" site.from="Prof Name <no-reply@yourdomain.com>"
```

4) Deploy only functions:

```bash
firebase deploy --only functions
```

Confirmation link
- The email template includes a confirmation link to `https://YOUR_CONFIRMATION_ENDPOINT/confirm?email=...&id=...`. Replace `YOUR_CONFIRMATION_ENDPOINT` with your own endpoint that verifies the subscriber and toggles `confirmed: true` in Firestore, or implement confirmation via another Cloud Function/HTTP endpoint.

Notes
- Use SendGrid or another email provider for higher deliverability.
- Make sure Billing is enabled if you expect higher volume or outbound limits.
