# Animation Specification & Timing Reference

This document catalogs every animation, trigger, duration, and easing across the engagement invitation. Timings are tied to design tokens in `src/styles/variables.css` or parameterized in their respective section timelines.

| Section / Component | Visual Effect / Motion | Trigger | Duration | Easing | Config / File Location |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0. Preloader** | Glow pulse & lantern fill | Asset/Font loading | Variable (0-100%) | `ease-out` | `src/sections/preloader.ts` |
| **0. Preloader Exit** | Fade + Scale out glow burst | 100% progress or "Open now" | `0.7s` (`--t-base`) | `var(--ease-out)` | `src/styles/components.css` |
| **1. Cover Seal** | Idle shimmer sweep & pulse | Page load / idle loop | `3.8s` loop | `ease-in-out` | `.cover-seal-btn::after` |
| **1. Cover Seal Break**| Squash, crack & sound click | Click / Tap / Enter | `0.5s` | `ease-in-out` | `.seal-cracking` |
| **1. Envelope Flaps** | Top & bottom flaps lift/split away | Seal tap completed | `1.4s` (`--t-slow`) | `var(--ease-in-out)` | `src/sections/cover.ts` |
| **2. Hero Lantern** | Harmonic pendulum sway | Infinite alternate loop | `4.5s` | `ease-in-out` | `.hero-lantern-container.sway` |
| **2. Hero Glow Halo** | Core candle flicker | Infinite alternate loop | `3.0s` | `ease-in-out` | `.hero-lantern-halo` |
| **2. Hero Floral Corners**| Scale in + parallax drift | Section reveal / Scroll | `1.6s` enter / Scrub | `power2.out` | `src/sections/hero.ts` |
| **2. Hero Names** | Split text character/line mask | Cover open | `1.2s` (stagger 0.2s) | `power3.out` | `src/sections/hero.ts` |
| **2. Scroll Chevron** | Bouncing vertical cue | Infinite loop | `2.2s` | `ease-in-out` | `@keyframes bounceChevron` |
| **3. Letter Parchment**| Scroll-driven unroll (pinned) | ScrollTrigger scrub | Scrubbed over scroll | `power2.out` | `src/sections/letter.ts` |
| **3. Letter Text** | Staggered line fade up | Parchment unrolling | `0.8s` (stagger 0.2s) | `power1.out` | `src/sections/letter.ts` |
| **4. Families Cards** | Staggered entrance | Scroll into view (80%) | `1.0s` (stagger 0.15s)| `power2.out` | `src/sections/families.ts` |
| **5. Celebration Cards**| 3D tilt & shine on hover | Pointer hover / move | Immediate lerp | `ease-out` | `src/sections/celebrations.ts`|
| **5. Event Entrance** | Staggered vertical lift | Scroll into view (75%) | `1.1s` (stagger 0.2s) | `power2.out` | `src/sections/celebrations.ts`|
| **6. Garlands** | Gentle pendular sway | Infinite alternate loop | `6.0s` | `ease-in-out` | `@keyframes garlandSway` |
| **6. Scratch Foil** | Canvas scratch off | Pointer / touch drag | Realtime | Immediate | `src/effects/scratchCard.ts` |
| **6. Petal Confetti** | Rose petal & gold burst | Cleared ≥ 60% or button | `2.5s` | Gravitational | `canvas-confetti` |
| **6. Countdown Clock** | Rolling/tick seconds update | Every 1.0s (rAF safe) | `1.0s` interval | Linear | `src/sections/countdown.ts` |
| **7. RSVP Quill** | Writing flourish rotate & enter | Scroll into view (75%) | `1.4s` | `power2.out` | `src/sections/rsvp.ts` |
| **7. RSVP Envelope** | Squash, stamp & fly-off | Submit form click | `1.2s` | `var(--ease-in-out)` | `.rsvp-card.flying-off` |
| **8. Floating Lanterns**| Upward ascension & sine wobble | "Release a lantern" tap| ~8.0s per lantern | Sinusoidal physics | `src/effects/lanterns.ts` |
| **Global Particles** | Ambient dust / ember float | Continuous background | rAF physics | Gentle upward float | `src/effects/particles.ts` |
| **Smooth Scroller** | Lenis smooth scroll inertia | Scroll wheel / touch | `1.2s` duration | Exponential decay | `src/effects/smoothScroll.ts` |
