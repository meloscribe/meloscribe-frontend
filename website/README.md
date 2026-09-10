# meloscribe — Official Web Platform

Modern piano arrangement catalog and digital sheet music platform built with React, TypeScript, and Tailwind CSS.

- **Production URL:** https://www.meloscribe.dev
- **Backend API:** https://api.meloscribe.dev
- **Deployment:** Vercel (automatic continuous deployment from `main` branch)

## Key Features

- **Full Arrangement Catalog:** Curated, complete piano arrangements with synchronized audio previews.
- **Floating Difficulty Indicators:** Dynamic `Original` / `Easy` frosted glass pill badges directly on artwork covers.
- **Multi-State Products:** Direct Stripe Checkout purchases, Sheet Music Direct ↗ external redirects, and Currently Unavailable safety locks.
- **Stripe Checkout Integration:** Dynamic IP-based localized currency detection (EUR, USD, GBP) and 1-tap mobile payments (Apple Pay / Google Pay).
- **Secure File Delivery:** Expiring Cloudflare R2 presigned download links via `/order/:hash`.
- **Multilingual Support:** Localized across 5 languages (English, German, French, Spanish, Italian).
- **SEO & Social Optimization:** Pre-rendered OpenGraph metadata, Rich Pin tags, and automated XML sitemap generation.

## Local Development

```bash
cd website
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
