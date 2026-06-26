# meloscribe-frontend — Learning & Bug Ledger

Technical insights and resolved bugs specific to the meloscribe website (`C:\Dev\meloscribe-frontend`).

---

### Ko-fi Widget limitations — use iframe modal instead
- The official `overlay-widget.js` only supports tip/floating chat. It cannot target specific shop products. Use a clean React iframe modal for product-specific checkouts.

---

### Vite SPA Routing without a full router
- Bind basic React state to `window.location.pathname` and intercept navigation. Provides lightweight zero-dependency routing without React Router overhead.

---

### Tailwind Header Border Transition Flashing
- Transitioning from `border-transparent` or `bg-transparent` to a dark color causes a brief white flash as the browser interpolates from `currentColor`.
- Fix: Use exact color bases with `0` opacity (e.g. `border-dark-600/0`, `bg-dark-900/0`) so the transition only interpolates the alpha channel — fully clean scroll shift.

---

### TypeScript AST fragility — use JSON for mutable data
- Overwriting structured TypeScript files via regex breaks with code formatters. Store the song array in `songs.json` and cast it in TypeScript (`as Song[]`). Both Python scripts and React components can safely read/write it.

---

### PowerShell Desktop Shortcuts — use Shell COM, not VBS
- Running `.vbs` files via WScript can be blocked by Windows Script Host execution policies.
- Fix: Use a PowerShell script that instantiates the Shell COM object directly. Allows `WindowStyle = 7` (minimized) without WScript.

---

### Bypassing Audio CORS Restrictions — use HTML5 Audio, not Web Audio API
- `MediaElementAudioSourceNode` (Web Audio API) triggers strict CORS checks on external CDN audio.
- Fix: Use a plain HTML5 `Audio` instance with `window.setInterval` for programmatic volume control. Smooth 300ms fade-in and 200ms fade-out without CORS issues.

---

### Card Hitbox Expansion — pointer-events on overlay effects
- Absolute overlay effects (neon hover glow cards) intercept user interactions and block underlying buttons.
- Fix: Set `pointer-events-none` on purely visual overlay elements so child buttons and links remain fully clickable.

---

### Vercel SPA Routing — must add vercel.json catch-all
- On Vercel, reloading or directly entering a nested path (e.g. `/imprint`, `/order/abc123`) results in `404 NOT_FOUND` because Vercel tries to find a physical file.
- Fix: Add `vercel.json` with `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` at the project root.

---

### Let's Encrypt Certbot — DNS must resolve first
- Certbot's HTTP-01 challenge fails if DNS hasn't propagated or if Cloudflare's orange proxy (CDN) is active (it intercepts the challenge request).
- Fix: Set Cloudflare records to DNS-Only (grey cloud). Verify resolution with `nslookup api.meloscribe.dev` before running certbot.

---

### Paddle Legal Compliance & Domain Review — harte Lektion
- **Issue**: Paddle hat die Domain-Verifizierung für meloscribe.dev abgelehnt ("Action required" im Dashboard). Kein Live-Checkout möglich trotz funktionierender technischer Integration.
- **Lesson**: Paddle führt einen manuellen Review durch. Folgendes muss zum Zeitpunkt des Reviews **physisch sichtbar und erreichbar** auf der Website sein:
  - Alle vier Rechtstexte auf Englisch: `/imprint`, `/privacy`, `/terms`, `/refunds`
  - Transparente Preisangaben direkt auf der Produktseite
  - Kein "Under Construction" Banner oder leere Seiten
  - Die Domain muss aktiv mit echten Inhalten laufen (kein Platzhalter)
- **Paddle-spezifisch**: Der 10%-Flat-Fee-Tarif (Mikrozahlungen) ist nicht im Dashboard dokumentiert. Klärung via Support-Ticket an sellers@paddle.com notwendig.
- **Status (2026-06-26)**: Support-Ticket läuft. Alle Rechtsseiten sind live. Warte auf manuelle Freischaltung.

---

### SQLite ALTER TABLE — no inline UNIQUE constraints
- `ALTER TABLE t ADD COLUMN c TEXT UNIQUE` fails in SQLite. `ALTER TABLE` does not support constraint keywords.
- Fix: Add column as plain `TEXT`/`INTEGER`. Enforce uniqueness in application logic.

---

### SQLite WAL mode for concurrent FastAPI workers
- Multiple background sync threads attempting concurrent SQLite writes cause `OperationalError: database is locked`.
- Fix: `sqlite3.connect(..., timeout=30.0)` + `PRAGMA journal_mode=WAL` at DB init. WAL allows one writer and multiple readers simultaneously.

---

### Ko-Fi cookie names — never assume ASP.NET defaults
- Actual Ko-Fi cookie names: `kofi_identity_cookie` and `kofiweb.session` — not the ASP.NET Core default `.AspNetCore.Identity.Application`.
- Fix: Always verify via DevTools (F12 → Application → Cookies → domain). Update `kofi_cookie.txt` with correct names.

---

### songs.json sync — Python pipeline writes, React reads
- The desktop upload pipeline (`r2_uploader.py --website_sync`) writes directly to `website/src/songs.json` in this repo. React reads it at build time.
- Ensure the pipeline path reference points to `C:\Dev\meloscribe-frontend\website\src\songs.json`.
- Songs now use `paddle_product_id` (not `kofiId`) as the purchase identifier.
