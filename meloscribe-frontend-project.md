# meloscribe-frontend — Project Status & Roadmap

Living documentation for the meloscribe website (`C:\Dev\meloscribe-frontend`).

**GitHub repo:** https://github.com/meloscribe/meloscribe-frontend (public)
**Hosted on:** Vercel (auto-deploy on push to `main`)
**Live URL:** https://www.meloscribe.dev

---

## Overview

A premium React + TypeScript + Tailwind CSS single-page app offering sheet music arrangements for pianists. Integrates Paddle v2 for payments, Cloudflare R2 for secure downloads, and Vercel Analytics for audience insights.

**Local dev:**
```bash
cd C:\Dev\meloscribe-frontend\website
npm run dev
```

---

## Architecture Notes

- **Framework:** React SPA built with Vite + TypeScript
- **Styling:** Tailwind CSS + custom neon/glassmorphism aesthetics
- **Routing:** Lightweight client-side routing via `window.location.pathname` state
- **Song catalog:** `website/src/songs.json` — read by both React and the Python upload pipeline
- **Payment:** Paddle v2 Billing (Paddle.js overlay checkout)
- **Download security:** `/order/:hash` success page → `api.meloscribe.dev/order/:hash` → 15-min R2 presigned URLs
- **Audio previews:** HTML5 `Audio` with programmatic 300ms fade-in / 200ms fade-out (no Web Audio API to avoid CORS)
- **Analytics:** Vercel Analytics (no cookie consent required)

**Vercel environment variables** (set in Vercel dashboard — not in repo):
- `VITE_PADDLE_CLIENT_TOKEN=live_5c6d7809f8cf8f527a1da05ae5b`

---

## Completed Milestones

- [x] Data-driven song architecture (`songs.json`)
- [x] Dynamic social media metrics (`siteConfig.ts`)
- [x] Ko-fi overlay modal → replaced with Paddle v2 checkout
- [x] Legal compliance pages: Imprint `/imprint`, Privacy `/privacy`, Terms `/terms`, Refunds `/refunds`
- [x] Premium song cards: 3/4 aspect ratio, difficulty + price badges overlay
- [x] Dark/light theme toggle with localStorage persistence (default: dark)
- [x] Light mode: full readability pass (headings, badges, footer, header)
- [x] Global audio preview hover system on catalog page
- [x] Diacritic-cleaning, space-insensitive, typo-tolerant search
- [x] Secure 3-step Paddle payment flow with permanent `/order/:hash` success pages
- [x] R2 presigned download links (15 min TTL, max 20 downloads per purchase)
- [x] SQLite `purchases` table with `download_hash` + `download_count`
- [x] Mobile layout fixes: header, footer, logo, language toggle, Buy Me Coffee button
- [x] `vercel.json` SPA fallback routing (all paths → `index.html`)
- [x] Vercel deployment linked to GitHub main branch
- [x] Product card visual redesign (Format badge on top-right, price inside the buy button, text block removed)
- [x] Persistent player mute preference stored in localStorage
- [x] Fixed iOS page transition blank screen in Safari by using state transitions
- [x] Enabled dual-state upvote/unvote toggling on community suggestions page
- [x] Configured seekable video stream proxy to bypass R2 CORS restrictions
- [x] Disabled hover audio on mobile/touch screens
- [x] Implemented dynamic client-side IP-based localized price previews via Paddle.PricePreview()

## Active Blockers / Next Steps

- **BLOCKED — Paddle Domain Verification abgelehnt**: Paddle Dashboard zeigt "Action required" — Domain-Review für meloscribe.dev wurde nicht bestanden. Support-Ticket an sellers@paddle.com verschickt zur Klärung der genauen Anforderungen und des undokumentierten 10%-Flat-Fee-Tarifs. Bis zur Freischaltung is kein Live-Checkout möglich.
- Paddle-Webhook End-to-End-Test (Checkout → webhook → `/order/:hash` → R2 Download) steht aus.
- Paddle-Webhook-Signaturprüfung auf dem Backend verifizieren sobald Freischaltung erfolgt.
