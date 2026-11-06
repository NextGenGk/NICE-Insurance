# NICE – Network of Insurance & Claims Expert

Insurance advisory workspace for **NICE – Network of Insurance & Claims
Expert**, a general insurance services provider in Amapara, Raipur,
Chhattisgarh. The app runs a lead from intake → product selection →
multi-insurer quotation → advisor advice → KYC → payment → underwriting
→ policy issuance.

The brand, contact details, service lines, insurer partners and imagery
in this app are taken from the official NICE website,
[niceinsurance.co.in](https://niceinsurance.co.in).

## Contact details

- **Address:** H No-C 108, Ground Floor, Opposite Life Worth Hospital, Amapara, Raipur, Chhattisgarh 492001
- **Phone:** +91 97714 20518 / +91 82104 37434
- **Email:** rajeev@niceinsurance.co.in
- **Social:** [Facebook](https://www.facebook.com/NICEINSURANCECOIN) · [Instagram](https://www.instagram.com/niceinsurancecoin/) · [LinkedIn](https://www.linkedin.com/in/rajeev-ranjan-20a531a8/)

## Services

The product picker mirrors NICE's actual service lines:

- Truck Insurance
- Car Insurance
- Bike Insurance
- Health Insurance
- Home Insurance
- Office Insurance
- Shop Insurance
- Travel Insurance

## Insurer partners

Quotes are generated against the general insurance companies listed on
NICE's site: Bajaj Allianz General, Cholamandalam MS, Edelweiss,
ICICI Lombard, IFFCO-Tokio, Liberty, Magma HDI, Oriental Insurance,
Reliance General, Royal Sundaram, SBI General, Shriram General,
Universal Sompo, United India, Kotak General, HDFC Ergo, New India
Assurance, Star Health and Future Generali.

Partner logos used by the app are the real logo files published in the
"General Insurance Companies" strip on niceinsurance.co.in, stored under
`public/logos`. The NICE brand logo and banner are stored under
`public/nice`.

## About NICE

> NICE – Network Of Insurance & Claims Expert is a General Insurance
> Services information Provider and was established by a team of
> professionals having experience of more than 13 years in the Insurance
> Industries. We aspire our presence across India and expanding our
> footprints. We understand that insurance is a complex subject, and we
> simplify it for you with the combination of Technology and Human Touch.
> We understand a client's requirements and estimate the level of optimum
> risk exposure before structuring information of an appropriate insurance
> solution. We understand and explain all the possible choices available
> in general, in simple terms, along with the benefits.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Prisma (v5, pinned) + Postgres (Neon)
- Clerk (advisor authentication)
- Groq (`openai/gpt-oss-120b`) for AI-estimated general insurance
  quotes, grounded in real Indian premium rate-card ranges — with a
  local fallback estimator if no API key is set, so the app never breaks
- Razorpay payments when keys are set, with a built-in mock checkout
  fallback when they aren't (or when `MOCK_RZP=true`)

## Setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL / DIRECT_URL (Neon), Clerk keys — these two are
# required for the app to run at all. GROQ_API_KEY and Razorpay keys
# are optional; the app falls back to local estimates / mock payments
# without them.
# NEXT_PUBLIC_APP_URL is the canonical origin used for metadata and
# share links; it defaults to https://niceinsurance.frequnsync.online.

npx prisma generate
npx prisma migrate dev --name nice_products
npx prisma db seed   # loads 4 sample leads + a demo advisor

npm run dev
```

Visit `http://localhost:3000`, sign up/sign in via Clerk, then click
through a lead.

> **Upgrading an existing database:** the `ProductType` enum changed from
> `LIFE / HEALTH / GENERAL` to the eight NICE service lines. Run a new
> Prisma migration (or reset the demo database) before seeding.

## What's real vs. mocked

| Step | Status |
|---|---|
| Brand, contact details, services, insurer list | Real — from niceinsurance.co.in |
| Insurer + brand logos | Real assets from niceinsurance.co.in |
| Lead intake, product selection, profile | Real (Postgres via Prisma) |
| Quotation | Real AI call to Groq, grounded in market rate ranges — not live insurer pricing |
| Advisor note/share | Saved to DB; "share" doesn't yet send a real WhatsApp/email |
| KYC | Real format validation + masking; not yet a live PAN/Aadhaar verification API |
| Payment | Real Razorpay when keys are configured; otherwise a built-in mock checkout that records a mock payment |
| Underwriting status | Manually advanced by the advisor (no live insurer webhook yet) |
| Policy issuance | Generates a policy record + reference number; not a real insurer-issued document |

## Swapping in real integrations later

- **Real insurer/aggregator quotes**: replace the body of
  `generateQuotes()` in `src/lib/groq.ts` (or call a real API from
  `src/lib/quotes.ts`) — the `Quotation` schema and UI stay the same.
- **Real KYC verification**: replace `verifyPan`/`verifyAadhaar` in
  `src/lib/kyc.ts` with a call to Surepass/Digio/Signzy.
- **Live Razorpay**: fill in the real keys in `.env` and clear or set
  `MOCK_RZP=false` — the real checkout path activates automatically once
  keys are present and mock mode is off.
- **Insurer webhooks for underwriting status**: replace the manual
  "Simulate insurer update" button in `StatusTracker.tsx` with a webhook
  handler that updates `Lead.status` automatically.

## A note on assets and trademarks

The NICE logo, banner and partner-company logos are the real images
published on niceinsurance.co.in and are bundled under `public/nice` and
`public/logos` for this branded build. If NICE wants them served from its
own infrastructure, move the files to a CDN and update the paths in
`NiceBrand.tsx`, `AuthBrandPanel.tsx` and `src/lib/insurers.ts`.
