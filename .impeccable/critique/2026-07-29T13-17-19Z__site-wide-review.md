---
target: site-wide-review
total_score: 17
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
timestamp: 2026-07-29T13-17-19Z
slug: site-wide-review
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The `/contact` SSR/i18n hydration race shows raw key `contactPage.backHome` and a blank body for 2-3s on every direct load — confirmed reproducible by both assessments. |
| 2 | Match System / Real World | 3 | Italian copy, PEC fields, euro pricing all correct; undercut by the English-language Spline "Services" panel. |
| 3 | User Control and Freedom | 1 | Opening the mobile hamburger menu on the **homepage specifically** crashes the whole app to a dead-end error screen (confirmed reproducible 3/3 by Assessment B; `/pricing` and `/contact` nav open fine at the same viewport, so it's a home-route regression, not a global one). |
| 4 | Consistency and Standards | 2 | BASE plan's CTA reads "Piano Base" (noun) vs. Professional/Premium's "Scegli ___" (verb) for the identical action; footer Privacy/Terms + 3 of 4 social icons are dead `href="#"` links. |
| 5 | Error Prevention | 2 | Forms use `required`/`maxLength` but a placeholder PEC value shipped live undetected; no consent/privacy copy in the lead-capture modal. |
| 6 | Recognition Rather Than Recall | 3 | Persistent nav, clear back-links, side-by-side plan comparison. |
| 7 | Flexibility and Efficiency | n/a | Persuade-mode marketing site — no repeat-user power features expected. |
| 8 | Aesthetic and Minimalist Design | 3 | Hero/Projects/pricing cards are disciplined; the Services/ServicesShowcase generic stock-icon panels are visual noise against the dark-chrome language (also flagged mechanically: `overused-font`, `gradient-text`, `codex-grid-background`). |
| 9 | Error Recovery | 1 | The mobile-nav crash's recovery screen is a generic "Something went wrong" with only Try Again/Go Home — no context, no graceful degrade. |
| 10 | Help and Documentation | n/a | Not applicable to a persuade-mode marketing/portfolio site. |
| **Total** | | **17/32** | **53% → Acceptable, low end** |

## Design Specificity Verdict

**LLM assessment**: The site is genuinely specific where it counts — the Hero's two-act liquid-chrome sequence and the Projects carousel's "spotlight studio" staging (hanging lights, one case study lit center-frame, spring-physics slide) make "cinematic case studies" a felt metaphor, not a slogan; nobody could drop these unchanged into an unrelated product. But specificity is inconsistent: the Services section is a stock Spline scene (generic cartoon robot, English caption, visible "Built with Spline" badge) on an otherwise Italian dark-cinematic site, and the `ServicesShowcase` GDPR/SEO panels use flat stock-SaaS clipart. These sit in the exact middle of the homepage, between two sections that are unmistakably bespoke — so the weakest, most generic-feeling stretch of the site is also its longest dwell point before the pricing teaser.

**Deterministic scan**: `detect.mjs` returned 5 findings across 3 rules, all `slop` category, all visually confirmed: `overused-font` ×3 (Inter + Space Grotesk, the same two fonts used everywhere — `__root.tsx:103`, `styles.css:175`, `styles.css:192`), `gradient-text` ×1 (`styles.css:201`), `codex-grid-background` ×1 (`styles.css:217`, the tiled dotted grid visible behind `/team`). None are false positives; all are legitimate "this could be any AI-scaffolded site" tells layered on top of the otherwise bespoke hero/carousel work.

## Overall Impression

The site's best two moments — the Hero and the Projects carousel — are genuinely premium and on-brand, exactly the "cinematic, not templated" pitch the studio is selling. But a **home-route-specific crash on mobile nav** is a real P0: a phone visitor on `/` cannot reach Pricing, Team, or Contact through the nav at all. Paired with a placeholder PEC live on two pages and a fee-disclosure sequencing issue on the pricing page itself, the site currently undersells its own craft with exactly the kind of live-production slip its own copy promises clients it won't make ("niente compromessi").

## What's Working

1. **The Projects carousel's "spotlight studio" staging** — three hanging spotlights over a dark stage, one card lit center-frame, drag/wheel physics, hairline editorial arrows instead of boxed buttons. The single most on-brand piece of the site.
2. **The Hero's two-act structure** — full-screen title dissolving into a scroll-scrubbed liquid-chrome sequence with crossfading promises, gated behind a deliberate boot sequence so WebGL never stutters into a half-hydrated page.
3. **The `/contact` WorldMap** — Bolzano fanning out to 7 world cities, held up cleanly at a genuinely-verified 390px mobile viewport (labels legible, no dot collisions) — a responsive win that's easy to get wrong with SVG+foreignObject labels.

## Priority Issues

**[P0] Mobile nav crashes the app — but only on the homepage.**
*Why it matters*: Confirmed 3/3 by isolated browser evidence: tapping the hamburger menu on `/` at 390×844 throws `NotFoundError: Failed to execute 'insertBefore' on 'Node'...` inside `<PresenceChild>`, and the route error boundary replaces the whole page with "This page didn't load." The identical action on `/pricing` and `/contact` opens the menu correctly with zero console errors — so this is a home-route-specific regression (most likely a Framer Motion `AnimatePresence` DOM race between the mobile nav overlay and the still-animating Hero/Spline scene), not a site-wide nav bug. Still: `/` is the page every new visitor lands on, and a phone visitor there cannot reach Pricing, Team, or Contact via nav at all.
*Fix*: Reproduce with React DevTools profiler open on `/` mobile width; the likely culprit is two competing `AnimatePresence`/portal trees mounting during the Hero's entrance animation while the nav overlay also mounts. Consider delaying nav-menu-open animations until the Hero's own entrance sequence has settled, or moving the nav's `AnimatePresence` output to a stable portal root untouched by the Hero's DOM churn.
*Suggested command*: `/impeccable optimize` (or a direct debugging session — this is a functional regression, not a taste question)

**[P1] A placeholder PEC address is live on two production pages.**
*Why it matters*: `src/lib/team-members.ts` line 29 (Emanuele Driussi's `pec` field) is literally `"nome.cognome@pec.it"` — rendered as-is, including as a clickable (broken) `mailto:` link, on both `/team` and `/contact`. For a studio pitching "no templates, no compromises," this is a concrete, visible reason for a prospect to distrust the rest of the copy the moment they read all three founder cards.
*Fix*: Get Emanuele's real PEC and update `team-members.ts` (I already flagged this was left pending intentionally — good time to close it out).
*Suggested command*: direct edit, no design command needed.

**[P1] The mandatory €50/month fee is disclosed after the price has already anchored.**
*Why it matters*: All three plans show "€X UNA TANTUM" and only after scrolling past all three cards does a separate card badged OBBLIGATORIO reveal a recurring €50/month regardless of plan. A visitor forms a "€750 total" expectation for BASE before learning it isn't total — this reads as cost misdirection even though clearly unintentional, right at the moment that matters most for trust.
*Fix*: Add a one-line "+ €50,00/mese manutenzione obbligatoria" directly under each plan's price, not only in the separate section below.
*Suggested command*: `/impeccable clarify`

**[P1] `/contact` shows raw i18n keys and a blank page on direct load (SSR/hydration race).**
*Why it matters*: Reproduced 100% by both assessments: server HTML emits `contactPage.backHome` instead of "Torna alla Home," the whole body renders blank for 2-3s, then React discards and rebuilds the mismatched subtree. Risk is twofold: a slower device could show this broken state far longer than observed, and any non-JS crawler or link-preview bot will index the raw key text instead of real Italian copy — an SEO/social-preview problem on a site whose own copy pitches SEO rigor as a selling point.
*Fix*: Ensure i18next resources are available synchronously during SSR for this route (likely a resource-loading-order issue specific to how `/contact`'s translation namespace is registered vs. `/team`'s, which didn't show the same symptom in earlier testing).
*Suggested command*: `/impeccable harden`

**[P2] The Projects carousel has no filter, only sequential drag/click through 18 cards.**
*Why it matters*: `Projects.tsx` defines a `categories` array (Tutti/Hospitality/Beauty/Automotive/Altro) but only uses it as a text label per card, never as clickable filter chips. A visitor running a hair salon must click through up to 17 irrelevant cards to find the two beauty-sector examples — the site's single best proof point is the hardest thing on the page to target to a specific visitor.
*Fix*: Render `categories` as clickable filter chips above the carousel.
*Suggested command*: `/impeccable layout`

**[P3] Inconsistent CTA verb + dead footer links.**
*Why it matters*: "Piano Base" (noun) vs. "Scegli Professional/Premium" (verb) for the identical action reads as a small inconsistency; footer Privacy/Terms and 3 of 4 social icons are dead `href="#"` — a flat close on the site's last impression.
*Fix*: Align BASE's button copy to "Scegli Base"; wire the real footer links or remove the ones with no real destination yet.
*Suggested command*: `/impeccable clarify`

## Persona Red Flags

**Jordan (first-timer, evaluating trust)**: Hits the generic Spline robot + English caption right after the strong Hero (an early "is this actually custom?" wobble) → later finds Emanuele's placeholder PEC on `/team` (a concrete reason to distrust the rest) → opens the pricing modal and hands over phone + email/PEC with no privacy/consent copy anywhere in that exact moment, directly undercutting the homepage's own GDPR-rigor pitch two sections earlier.

**Casey (mobile)**: Cannot open the nav at all on `/` — Pricing/Team/Contatti/Richiedi Preventivo all unreachable via nav on a phone landing on the homepage specifically. Landing on `/contact` from a shared link (a very plausible mobile scenario) shows a blank page for several seconds before content resolves — easy to mistake for a broken link and bounce.

## Minor Observations

- Homepage's contact form labels the field "EMAIL" while the pricing modal's equivalent field is "EMAIL O PEC" — same purpose, inconsistent framing across two forms on the same site.
- Orphaned unused `services.label`/`caption1`/`caption2` English strings in `i18n/index.ts` (Services.tsx hardcodes its own Italian copy instead) — safe to prune.
- Three.js/Spline hero throws a genuine (non-HMR-noise) console warning/error pair (`Multiple instances of Three.js being imported` / `Missing property`) worth a quick look even though it didn't visibly break anything in testing.

## Questions to Consider

1. Is the Spline "Services" scene meant to be temporary/placeholder, or is it staying — given the studio's own pitch is "ingegneria 3D, non decorazione," is a stock Spline template the one section actively working against that claim?
2. What if the mandatory monthly fee were folded into each plan's headline price display instead of disclosed separately — would that read as more honest without making BASE look relatively more expensive than Premium (which already includes a year of maintenance)?
3. What if the Projects carousel opened filtered to the visitor's own vertical (a lightweight "what's your business?" chip on first scroll) instead of always starting at card 01/18 — would that turn the site's strongest asset into a sharper qualification tool?
