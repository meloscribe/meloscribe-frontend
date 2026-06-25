# meloscribe website project

This is the central source of truth for the meloscribe website development.

## Project Overview
A premium React + TypeScript + Tailwind CSS website for meloscribe, offering premium sheet music arrangements for pianists.

## Current Roadmap
- [x] Establish workspace `.gitignore`
- [x] Set up data-driven song architecture (`songs.ts` casting `songs.json`)
- [x] Connect dynamic social media metrics (`siteConfig.ts`)
- [x] Integrate Ko-fi overlay modal logic
- [x] Add legal compliance pages (Imprint, Privacy Policy)
- [x] Create a Windows desktop shortcut for the website
- [x] Implement premium song card price badges
- [x] Redesign sheet music card button to use "Unlock Sheets" + ShoppingBag icon
- [x] Implement gorgeous dark mesh gradient fallback for missing cover images
- [x] Add automated song synchronization directly from the Python uploader to `songs.json`
- [x] Clean up header by removing header social icons and replacing them with a premium "Buy me a Coffee" button
- [x] Add a secondary "Buy a Coffee" text link in the footer next to legal links
- [x] Update Facebook handle configuration to `@meloscribe`
- [x] Synchronize and replace placeholder mock songs in `songs.json` with the 33 actual live Ko-fi shop products
- [x] Implement client-side routing for `/sheets` containing the full arrangements list
- [x] Limit homepage sheet music grid to display only the first row (the 3 latest sheets)
- [x] Resolve difficulty tag inaccuracies to label only titles with "easy" as `'Easy'` and default all others to `'Original'`
- [x] Fix "Unlock Sheets" modal button (loads secure redirect to avoid CSP iframe issues)
- [x] Eliminate the brief white border line flash appearing on the header when scrolling from the top by transitioning on alpha opacity.
- [x] Migrate song catalog data storage from TypeScript AST parsing to pure JSON (`songs.json`)
- [x] Implement dark/light theme toggle in header with localStorage persistence
- [x] Redesign sheet cards to use 3/4 aspect ratio cover art with difficulty and price badges overlay
- [x] Implement diacritic-cleaning, space-insensitive, typo-tolerant search
- [x] Create dedicated "Website Catalog" tab inside the Meloscribe desktop app for catalog CRUD actions (visibility, difficulty, edit, delete, add)

- [x] Set default theme to dark mode on first visit (no prefers-color-scheme fallback)
- [x] Fix light mode: readable text for all headings, paragraphs, badges, and stats
- [x] Fix light mode: header scroll uses white glassmorphic background (not dark)
- [x] Fix light mode: footer uses white/light background (not dark gray)
- [x] Fix language dropdown and nav links for light mode readability
- [x] Fix Browse Sheets button text visibility in light mode
- [x] Enhance logo hover animation with bouncy elastic motion and alternating neon drop shadows
- [x] Complete global audio preview hover system on sheets catalog page grid
- [x] Add click listeners to cover images in all grids to trigger the Ko-fi checkout modal (hitbox expansion)
- [x] Implement dynamic highlight timestamps support based on condensed structures
- [x] Replace Ko-fi integration with Paddle v2 checkout flow
- [x] Implement secure /success and verify download flow via Cloudflare R2 presigned URLs
- [x] Initialized Git repository for meloscribe-website and created initial commit (main branch)
- [x] Add Terms of Service (/terms) and Refund Policy (/refunds) pages for Paddle compliance
- [x] Rename `/impressum` and `/datenschutz` to `/imprint` and `/privacy` for standardized English URL naming
- [x] Add vercel.json configuration to handle SPA fallback routing to index.html
- [x] Fix mobile layout cut-off issues inside header elements (logo, mute, language, coffee button) and footer legal links
- [x] Implement secure 3-step Paddle payment flow with permanent unique success pages `/order/:hash`
- [x] Protect downloads with 15-minute Cloudflare R2 presigned URLs and a limit counter (max 20 downloads)
- [x] Migrate `purchases` SQLite table with `download_hash` and `download_count` columns
- [x] Configure SQLite connection timeout limits and enable WAL mode to prevent database locks

## Active Blockers
- **DNS / Domain Propagation**: Waiting for domain nameservers on Spaceship to be updated to Cloudflare and DNS mapping (Vercel & Oracle backend A-record) to resolve.
- **SSL Certificate**: Let's Encrypt Certbot setup on Oracle server pending until DNS propagation is complete.

## Architecture Notes
- React SPA built with Vite.
- Styling with Tailwind CSS and premium custom neon aesthetics.
- Client-side route simulation for legal links and `/sheets` catalog page.
- Inter-workspace automation connects the `meloscribe` upload pipeline with this repository's data file.
- Header scroll transitions use exact color bases with alpha interpolation to prevent browser color flashing.
- Catalog data stored in `songs.json` to prevent AST parsing issues during edits.
- Global HTML5 Audio state management with Programmatic Fade-In (300ms) and Fade-Out (200ms) to bypass cross-origin browser autoplay blockades.

## Infrastructure & Hosting Architecture (meloscribe.dev)

This section documents the infrastructure, network security, and deployment layout established on **2026-06-25** to host the Meloscribe platform securely and for free.

### 1. Domain & DNS Control (Cloudflare)
The domain `meloscribe.dev` is registered on **Spaceship**. The domain nameservers are pointed to **Cloudflare** for unified DNS dashboard management, SSL edge security, and DDoS protection.

**DNS Settings (Cloudflare):**
- `meloscribe.dev` (Apex) -> `A` Record -> `76.76.21.21` (Vercel Anycast IP) | DNS Only (Graue Wolke)
- `www.meloscribe.dev` -> `CNAME` Record -> `cname.vercel-dns.com` | DNS Only (Graue Wolke)
- `api.meloscribe.dev` -> `A` Record -> `152.70.23.171` (Oracle VM Public IP) | DNS Only (Graue Wolke)

### 2. Frontend Hosting (Vercel)
- **Source Code**: React/Vite/TS SPA codebase is located in the GitHub repository `meloscribe-website`.
- **Deployment Flow**: Linked directly to Vercel. Every push to the `main` branch triggers an automated build and deploy.
- **Analytics**: Vercel Analytics integration tracks views and demographics without requiring a cookie consent banner.

### 3. Backend Hosting (Oracle Cloud VM)
- **Infrastructure**: Oracle Cloud Infrastructure (OCI) Free-Tier Ubuntu 24.04 LTS Instance (`152.70.23.171`).
- **Web Server & Reverse Proxy**: Nginx proxypasses public HTTPS requests for `api.meloscribe.dev` to localhost port `8787` (Uvicorn running FastAPI).
- **SSL Certificate**: Let's Encrypt TLS certificate generated via Certbot. Automatic renewal is handled by `certbot.timer` systemd service.

