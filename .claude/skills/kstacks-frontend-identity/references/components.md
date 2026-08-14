# KStacks Component Inventory & New-Component Rules

Confidence key: **[CONFIRMED]** = observed structurally on the live site (exact visual CSS not verified). **[DEFAULT]** = inferred/recommended, verify in repo.

## Confirmed component patterns

### 1. Official Service Card — [CONFIRMED structure]
Used in the "Official Stack Services" grid. Structure, in order:
- Optional status badge, overlaid/attached to the card (`Beta`, `Coming Soon`)
- Brand logo mark (light/dark SVG pair — see "Logo usage" below)
- Service short-name (e.g. "Index", "Planner", "Groups", "Grades", "Devs", "Subjects")
- Tagline (e.g. "Course & Section Search")
- One-sentence description
- CTA: `Open Service` (active, links out) or a disabled-styled `Under Development` (for "Coming Soon" services)

**Rule:** the CTA label and enabled/disabled state must match the badge — a "Coming Soon" card should never show "Open Service", and a live card should never show "Under Development". Keep this pairing consistent in any new service card you add.

### 2. Community/Student Project Card — [CONFIRMED structure]
Used in "Powered by KStack". Visually/structurally distinct from the Official Service Card — **do not reuse the exact same card component for both**, since the content shape differs:
- No brand logo mark (these are third-party/community projects, not KStack's own services)
- Project name
- One-sentence description
- Attribution line: `by {Name or Org}`
- Optional outbound link

A special variant of this card is the **"Your Project Here" placeholder card** — same shape, but content is an invitation rather than a real project (name: "Your Project Here", description: "The stack is incomplete without you. Build the next essential tool and claim this spot.", attribution: "by You"). This placeholder-as-CTA pattern is a nice on-brand trick — reuse it anywhere you have a grid that's intentionally not full yet, instead of just leaving empty grid slots.

### 3. Value/Feature Block — [CONFIRMED structure]
Used twice on the homepage (student-facing values, and developer-facing values). Simple, no card chrome/border implied by the copy structure:
- Icon (not textually confirmed which icon set — verify in repo, but expect small, line-style or duotone icons matching a clean SaaS aesthetic, not skeuomorphic)
- Short bold heading (2–3 words: "Open Source First", "Smart Sync", "Unified Auth")
- One-sentence plainspoken description

**Rule:** always exactly one icon + heading + one sentence. Don't add bullet lists or multi-paragraph copy inside a value block — if you need more explanation, that's a sign the content belongs on its own page/section, not squeezed into this block shape.

### 4. Badge — [CONFIRMED existence, styling not verified]
Two known values: `Beta`, `Coming Soon`. Small label, attached to a service card. Likely a pill/rounded-rect with a background tint (candidate: `brand-tint` `#8ADDC0` background with `brand-shade`/`ink-dark` text, or a neutral gray for "Coming Soon" vs. green-tinted for "Beta" to visually differentiate "actively live but early" from "not live yet") — **[DEFAULT]**, confirm actual styling in repo. If adding a new badge state (e.g. "New", "Deprecated"), keep it a short 1–2 word label, not a sentence.

### 5. CTA Button — [CONFIRMED existence, two apparent tiers]
- **Primary:** "Open Service", "Contact Us", "Read More!", "Log in / Sign in" — likely solid `brand-primary` background — [DEFAULT styling, CONFIRMED as the primary action pattern]
- **Secondary/disabled:** "Under Development" — visually muted/disabled state on cards that aren't live yet.
- **Link-style CTA:** "Download The Booklet" — reads as a plain link/text CTA rather than a button, since it's paired inline with a "Contact Us" button rather than styled as a second competing button — [DEFAULT, verify].

**Rule:** don't invent a third visual button tier (e.g. an outlined button) unless the repo already has one — the site's copy suggests a simple primary/secondary/link hierarchy, not a complex button system.

### 6. Logo usage / brand mark — [CONFIRMED pattern — live site + brand deck]
Every brand mark on the site (kstack, kindex, kplanner, kgroups) ships as **two separate SVG files**, a light variant and a dark variant (e.g. `kstack-light.svg`, `kstack-dark.svg`), both present in markup with visibility switched by theme — **not** a single-file logo with a CSS `filter: invert()` or currentColor trick.

The official brand deck (`assets/brand-deck/03-logo-construction.png`) confirms *why* this is necessary, not just *that* it's the pattern: the mark is a **layered 3D diamond built from 3 symbolically-distinct facets** (student/service/reflection/infrastructure — see `design-tokens.md` § Logo), and the finished lockup is **recomposed per background**, not just recolored — different facets get emphasized or lightened depending on whether it sits on black, white, or brand-green. A single-file-plus-filter approach cannot reproduce this correctly.

Also confirmed: the wordmark "KStack" always sets the **K in brand-primary green**, with the rest of the word in the ambient foreground color (white on dark backgrounds, black on light backgrounds) — never a flat single-color wordmark.

**Rule:** whenever a new brand mark (new service logo, a new lockup, a favicon variant) is added, provide it as a light/dark pair (or more, if a green-background variant is also needed) and swap by theme, matching the existing pattern and the deck's documented per-background recomposition — don't take a shortcut with CSS filters.

### 6a. Service icon family — [CONFIRMED — brand deck, slide `07-service-icons.png`]
Beyond the main KStack diamond mark, there's a family of 6 sharp-angled, diamond/chevron-based service icons (one is clearly the "GPA" wordmark for Grades), each required to render legibly in **4 canonical variants**: brand-green-on-black, white-on-black, brand-green-on-white, black-on-white. See `design-tokens.md` § Service icon family for the full rule set. Any brand-new service icon must follow this same 4-variant contract and angular construction language — don't introduce a softer/rounded/illustrative icon style for one service while the rest of the family stays sharp-angled.

### 7. Header nav / theme + menu toggle — [CONFIRMED on groups.kstacks.org]
groups.kstacks.org's header exposes: logo/wordmark link, an "About" nav link, a **"Toggle theme"** control (light/dark switch), and a **"Toggle menu"** control (mobile hamburger). This is real evidence of:
- A working dark/light theme switcher component exists somewhere in the ecosystem's codebase (or at least on this sub-app) — reuse/reference its implementation rather than building a new one from scratch, once you have repo access.
- A responsive header that collapses to a hamburger menu on small viewports.

**Rule:** any new page's header should follow this same two-toggle pattern (theme + mobile menu) rather than inventing a different responsive-nav approach, unless the specific page is a focused single-purpose tool where a full header doesn't make sense (e.g. an embedded widget).

### 8. Loading state — [CONFIRMED copy, unconfirmed visual]
The homepage includes literal loading copy: **"Stacking..."**. Any new loading/skeleton state should carry on-brand micro-copy like this rather than a bare spinner with no text, continuing the "Stack" wordplay where it fits naturally (don't force a pun if it reads awkwardly — "Stacking..." works for a page load; a form-submit spinner might just need a plain "Saving..." if a pun would feel forced).

## Designing new components that don't exist yet

When you need a component with no direct precedent on the marketing site (a settings panel, an auth form, a data table, a dashboard widget, a modal, a toast/notification, a multi-step form, a search input with filtering — several of the actual services like kindex and kplanner clearly need these even though the marketing site doesn't show them), derive it from the confirmed identity rather than defaulting to generic UI-kit look:

1. **Color:** primary actions get `brand-primary` (`#15BB81`); never invent a second "primary" hue. Status colors (error/warning) should stay clearly separate from the green brand family so they don't get visually confused with "success/primary".
2. **Shape language:** match the soft-rounded, card-based, low-shadow language of the existing service/project cards (see `design-tokens.md` for suggested radius defaults) — don't introduce sharp-cornered or heavy-neumorphic elements as a one-off.
3. **Density/copy tone:** keep microcopy short and plain, matching the observed voice (see `design-tokens.md` § Voice/microcopy patterns) — error messages, empty states, tooltips, and form labels should all read like the rest of the site: direct, a little warm, never corporate.
4. **Iconography:** default to a simple line-icon set consistent with a modern edtech/SaaS product (verify against repo — e.g. lucide-react is a very common, low-cost-to-assume choice for a modern React stack, but confirm before hardcoding an import). Don't mix icon styles (e.g. filled + outline) within one screen.
5. **Motion:** restrained, per `design-tokens.md` § Motion — hover/focus feedback should be quick and subtle, not the primary source of "personality" (that job belongs to copy and the green/Alexandria/diamond-logo identity, not bouncy animation).
6. **Empty/placeholder states:** follow the "Your Project Here" precedent — an empty state is an opportunity for on-brand, slightly playful copy, not just a gray "No data" message.
7. **Bilingual/RTL support:** every new component must be built RTL-safe from the start (logical CSS properties, mirrored icons where directional) — see `i18n-rtl.md`. Don't treat this as a later retrofit; at least one live sub-app (grades.kstacks.org) is fully Arabic/RTL today.

## Frontend anti-patterns to avoid (would look inconsistent with KStacks)

- Using any accent color other than the confirmed green family (`#15BB81` / `#8ADDC0` / `#1A6F52`) as a "brand" color for a new section or sub-app. A semantic status color (red for errors, amber for warnings) is fine; a second "brand-ish" hue (blue, purple) is not.
- Swapping **Alexandria** for a different display font "for variety," or for a Latin-only face that then needs a bolted-on separate Arabic font (Alexandria already covers both scripts natively — see `i18n-rtl.md`). If a second font is genuinely needed (e.g. a monospace font for code snippets on `kdevs`), it should be a clearly *functional* pairing (code font), not a competing display face.
- Recoloring the logo's three diamond facets arbitrarily, or flattening it to a single color outside of an explicitly-monochrome context (e.g. a single-color favicon) — the facets carry specific palette roles and symbolic meaning (student/service/infrastructure/reflection), documented in `design-tokens.md` § Logo.
- Using CSS filters to fake a dark-mode logo instead of swapping to the real dark-variant SVG — breaks the confirmed light/dark logo-pair pattern.
- Corporate marketing tone in copy ("Unlock unparalleled productivity", "Empowering the next generation of..."). KStacks copy is short, plain, and a little cheeky — see the Voice section in `design-tokens.md`.
- Treating this as a single monolithic product. It's an *ecosystem of independent services* fronted by a marketing/portal page and (eventually) SSO — new features usually belong inside the relevant service's own app, not bolted onto the kstacks.org marketing page, unless they're genuinely ecosystem-wide (like SSO, the service catalog, or the developer-recruitment story).
- Hardcoding left/right instead of start/end in CSS, given the ecosystem has confirmed real Arabic/RTL usage (grades.kstacks.org). See `i18n-rtl.md`.
- Building a generic, ungrounded "modern SaaS" landing page (hero + 3 random feature icons + testimonials carousel + pricing table) when asked for "a new KStacks page" — this brand has no pricing (everything is free-forever) and no testimonials pattern observed; don't import boilerplate sections that don't fit the actual site.
- Ignoring the badge/status vocabulary already established (`Beta`, `Coming Soon`, `Under Development`) and inventing new synonyms for the same states (e.g. "In Progress", "Preview") — reuse the existing vocabulary for consistency across the ecosystem.
