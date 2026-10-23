# Ahmad & Mawra — Luxury Digital Engagement Invitation

A luxury, scroll-driven digital engagement invitation designed as a single deployable static site. Built from scratch with vanilla TypeScript, custom CSS properties, GSAP + ScrollTrigger, Lenis smooth scrolling, canvas scratch-to-reveal card, and interactive floating lanterns.

---

## 🏛 Architecture & Tech Stack

- **Runtime**: Vite + Vanilla TypeScript (zero bloated UI framework overhead).
- **Styling**: Pure CSS with Custom Properties on `:root` and `[data-theme]` (no Tailwind dependency).
- **Motion Choreography**: GSAP + ScrollTrigger for scroll-driven scrubbed parchment and staggered card reveals.
- **Inertial Smooth Scrolling**: Lenis synchronized with GSAP ticker.
- **Interactive Canvases**: 
  - Ambient glowing dust & ember particles.
  - Metallic gold scratch-card heart with rose petal & champagne gold confetti burst.
  - Interactive "Release a Lantern" floating sky lantern system (pooled, capped at 30).
- **Audio Experience**: Web Audio API ambient acoustic harp soundscape & tactile wax-seal crack synthesis (zero network audio dropouts, persistent mute toggle).
- **Accessibility & Internationalization**: Diacritized Arabic text with `dir="rtl"` and `lang="ar"`, semantic landmarks, native form controls, and full `prefers-reduced-motion` compliance.

---

## ⚙️ Content Configuration (`src/config.ts`)

All user-facing copy, couple names, dates, venues, timeline items, dress codes, verses, contact details, and API endpoints live in **one centralized file**: `src/config.ts`. No hardcoded strings exist in components.

```typescript
export const INVITATION_CONFIG = {
  couple: {
    groom: 'Ahmad',
    bride: 'Mawra',
    monogram: 'A & M',
    headline: 'Ahmad & Mawra',
    tagline: 'Invite you to celebrate their engagement',
  },
  eventDate: {
    iso: '2026-12-18T19:00:00+05:00',
    fullDisplay: 'Friday, December 18, 2026 at 7:00 PM PKT',
    timeZone: 'Asia/Karachi',
  },
  // ... events, timeline, venues, RSVP deadlines, and Arabic verses
};
```

---

## 🎨 Swapping Color Palettes & Theme Tokens

Themes are switchable at runtime via the `data-theme` attribute on `<html>` and defined in `src/styles/variables.css`.

Included themes:
1. `aubergine` (Default Dark-Luxe: Deep Aubergine `#2b1a2e`, Champagne Gold `#d4af7a`, Blush Rose `#e8b4b8`)
2. `emerald` (Royal Emerald `#10261f`, Champagne Gold, Mint Frost)
3. `sapphire` (Midnight Sapphire `#141c2c`, Silver Champagne, Frost Blue)
4. `rose` (Velvet Burgundy `#2c1a20`, Dusty Rose, Soft Gold)

To add your own theme, add a selector block in `src/styles/variables.css`:

```css
[data-theme="my-palette"] {
  --bg-deep: #1a1e28;
  --bg-surface: #242938;
  --ink: #f7f9fc;
  --accent-gold: #e5c07b;
  --accent: #98c379;
}
```

---

## 🖼 Asset Replacement Guide (`/public/assets/`)

All placeholder graphics are handcrafted SVGs in `/public/assets`. You can replace any file 1:1 with your custom vector or WebP artwork without changing code:

| Asset Path | Description | Recommended Dimensions |
| :--- | :--- | :--- |
| `/public/assets/lantern.svg` | Central hanging filigree lantern | 120 × 280 viewBox |
| `/public/assets/wax-seal.svg` | Monogram wax seal stamp | 160 × 160 viewBox |
| `/public/assets/floral-corner-left.svg` | Top-left / bottom-left botanical corner | 240 × 240 viewBox |
| `/public/assets/floral-corner-right.svg` | Top-right / bottom-right botanical corner | 240 × 240 viewBox |
| `/public/assets/divider-ornate.svg` | Symmetrical arabesque divider line | 500 × 50 viewBox |
| `/public/assets/headpiece.svg` | Arch headpiece for scroll letter | 320 × 80 viewBox |
| `/public/assets/quill.svg` | RSVP feather quill flourish | 160 × 160 viewBox |
| `/public/assets/still-life.svg` | Vintage inkpot and scroll vignette | 260 × 180 viewBox |
| `/public/assets/garlands.svg` | Hanging bead strands for countdown | 600 × 120 viewBox |
| `/public/assets/icon-mangni.svg` | Engagement rings celebration icon | 100 × 100 viewBox |
| `/public/assets/icon-dinner.svg` | Gala dinner celebration icon | 100 × 100 viewBox |
| `/public/assets/icon-dholki.svg` | Dholki musical night icon | 100 × 100 viewBox |

---

## 📬 Connecting the RSVP Endpoint

1. In `src/config.ts`, set `rsvp.apiEndpoint` to your webhook or API endpoint URL (e.g. `https://rsvp.yourdomain.workers.dev` or a Google Apps Script Web App URL).
2. See [`docs/serverless-rsvp.md`](docs/serverless-rsvp.md) for full Cloudflare Worker and Google Sheets backend code examples.

---

## 🚀 Deployment Instructions

### Build Command
```bash
npm run build
```
Generates a static output in the `/dist` directory.

### Deploying to Netlify
- Build command: `npm run build`
- Publish directory: `dist`

### Deploying to Vercel
- Framework Preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Deploying to Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `dist`

---

## 🧪 Testing & Verification

Run the deterministic logic tests:
```bash
npx --yes tsx --test src/utils/rules.test.ts
```
Verifies RFC-5545 `.ics` formatting, countdown calculations, scratch clearance algorithms, and RSVP validation.
