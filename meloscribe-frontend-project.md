# meloscribe-frontend — Project Status & Roadmap

Living documentation for the meloscribe website (`C:\Dev\meloscribe-frontend`). Last updated: 2026-07-10.

**GitHub repo:** https://github.com/meloscribe/meloscribe-frontend (public)
**Hosted on:** Vercel (auto-deploy on push to `main`)
**Live URL:** https://www.meloscribe.dev

---

## Overview

A premium React + TypeScript + Tailwind CSS single-page app offering sheet music arrangements for pianists. Integrates Stripe Checkout for payments, Cloudflare R2 for secure downloads, and Vercel Analytics for audience insights.


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
- **Payment:** Stripe Checkout redirect flow (FastAPI session creation)
- **Download security:** `/order/:hash` success page → `api.meloscribe.dev/order/:hash` → 15-min R2 presigned URLs (max 50 downloads)

- **Audio previews:** HTML5 `Audio` with programmatic 300ms fade-in / 200ms fade-out (no Web Audio API to avoid CORS)
- **Analytics:** Vercel Analytics (no cookie consent required)

**Vercel environment variables** (set in Vercel dashboard — not in repo):
- None (all payment integrations are managed securely via backend Stripe API)


---

## Completed Milestones

- [x] Data-driven song architecture (`songs.json`)
- [x] Dynamic social media metrics (`siteConfig.ts`)
- [x] Ko-fi overlay modal → replaced with Stripe Checkout

- [x] Legal compliance pages: Imprint `/imprint`, Privacy `/privacy`, Terms `/terms`, Refunds `/refunds`
- [x] Premium song cards: 3/4 aspect ratio, difficulty + price badges overlay
- [x] Dark/light theme toggle with localStorage persistence (default: dark)
- [x] Light mode: full readability pass (headings, badges, footer, header)
- [x] Global audio preview hover system on catalog page
- [x] Diacritic-cleaning, space-insensitive, typo-tolerant search
- [x] Secure 3-step Stripe payment flow with permanent `/order/:hash` success pages
- [x] R2 presigned download links (15 min TTL, max 50 downloads per purchase)
- [x] SQLite `purchases` table with `download_hash` + `download_count` + `downloaded_types`

- [x] Mobile layout fixes: header, footer, logo, language toggle, Buy Me Coffee button
- [x] `vercel.json` SPA fallback routing (all paths → `index.html`)
- [x] Vercel deployment linked to GitHub main branch
- [x] Product card visual redesign (Format badge on top-right, price inside the buy button, text block removed)
- [x] Persistent player mute preference stored in localStorage
- [x] Fixed iOS page transition blank screen in Safari by using state transitions
- [x] Enabled dual-state upvote/unvote toggling on community suggestions page
- [x] Configured seekable video stream proxy to bypass R2 CORS restrictions
- [x] Disabled hover audio on mobile/touch screens
- [x] Implemented dynamic client-side IP-based localized currency and pricing previews
- [x] Intercepted client checkout completion events to redirect parent window using transaction ID, resolving success page verification timeouts

- [x] Completely hid desktop & mobile checkout iframe scrollbars
- [x] Removed legacy ZIP package cards to optimize duplicate Cloudflare R2 storage usage
- [x] Fully translated website pages (OrderDetails, Suggestions, Success, App) into English, German, French, Spanish, and Italian
- [x] Resolved tag syntax/div mismatch issues in `OrderDetails.tsx` and validated production build (`npm run build` compiles cleanly)
- [x] Updated all email/support references on the website from support@meloscribe.dev to info@meloscribe.dev
- [x] Suchfilter (Format & Schwierigkeit) standardmäßig eingeklappt auf Mobile (mit Neon-Pink/Neon-Cyan Toggle-Button) und standardmäßig ausgeklappt auf Desktop (Toggle-Button ausgeblendet)
- [x] Checkout-Gate-Modal (`PaddleModal.tsx`) UX optimiert:
  - Scrollen auf dem Hauptdokument gesperrt und erzwungene Backdrop-Weichzeichnung (blur(16px)) auf allen Endgeräten bei geöffnetem Modal
  - Steuer- und Support-Methoden-Hinweistexte unter dem Checkout-Button entfernt, Button in "Pay Securely" umbenannt und Stripe-Titel durch "Proceed to secure checkout to get instant access" ersetzt
  - Mobilversion restrukturiert: Features-Checkliste ausgeblendet, kompakter Song-Header und eine Inhaltsangabe direkt über dem Checkout-Button
  - "Secure SSL Connection" Footer auf Mobile ausgeblendet
  - "Viral Part" psychologisch reframed (Vorteilsargumentation statt Warnungen/Einschränkungen) und visuell einheitlich in warmem Bernstein-Gelb/Orange gehalten auf Desktop und Mobile

## Active Blockers / Next Steps

- Keine aktiven Blockaden. Das Payment-Gateway wurde am 2. Juli vollständig auf Stripe Checkout (redirects via FastAPI-Sessions) migriert. Die Domain-Verifizierung läuft fehlerfrei.
- End-to-end sandbox checkout flows have been fully verified with client event redirection and direct transaction lookup fallback; live webhook sign verification is active.

