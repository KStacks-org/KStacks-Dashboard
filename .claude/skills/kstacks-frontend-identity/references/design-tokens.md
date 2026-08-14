# KStacks Design Tokens

Confidence key used throughout: **[CONFIRMED — brand deck]** = from the official "KStack Visual Identity" deck (stored at `assets/brand-deck/`, provided directly by the KStack team — this is the single most authoritative source in this skill and overrides anything else if they conflict). **[CONFIRMED — live site]** = observed directly on kstacks.org or a sub-app. **[DEFAULT]** = a reasonable choice consistent with confirmed facts, not yet verified against real CSS — check `verification-checklist.md` and correct this file once you have repo access.

> The full brand deck is saved as images at `assets/brand-deck/01-cover.png` through `08-closing.png`. Open them directly if you need to see the exact visual reference (logo construction diagram, icon family, color chart) rather than relying only on the text description below.

## Color — [CONFIRMED — brand deck, slide `06-colors.png`]

This is the **official, finalized 6-color palette**, named and specified by the brand team with exact HEX/RGB/CMYK:

| Token | Role name (official) | Hex | RGB | CMYK | Usage |
|---|---|---|---|---|---|
| `brand-primary` | Primary — Emerald Green | `#15BB81` | 21, 187, 129 | 89, 0, 31, 27 | The core brand color. Primary CTAs, active states, the main logo fill, links, focus rings. |
| `brand-secondary-1` | Secondary 01 — Light Reflected Green | `#8ADDC0` | 138, 221, 192 | 38, 0, 13, 13 | Lighter mint tint. Secondary accents, hover backgrounds, subtle badges, the logo's "reflected/student" top facet. |
| `brand-secondary-2` | Secondary 02 — Dark Reflected Green | `#1A6F52` | 26, 111, 82 | 77, 0, 26, 56 | Darker green shade. Hover/active state for primary buttons (darken-on-press), dark-mode accents, the logo's "infrastructure" bottom facet. |
| `accent-black` | Accent 01 — Black | `#0B0B0B` | 11, 11, 11 | 0, 0, 0, 96 | Near-black. Dark-mode page background, primary text on light backgrounds where a true black would be too harsh. |
| `accent-grey` | Accent 02 — Grey | `#434242` | 67, 66, 66 | 0, 1, 1, 74 | Neutral gray. Muted/secondary text, borders, dividers. |
| `accent-white` | Accent 03 — White | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | Pure white. Light-mode page background, primary text on dark backgrounds. |

**Correction from earlier version of this skill:** the previous draft (sourced from OCR of the printed brand booklet PDF) listed white as `#FEFFFF` and included two extra dark grays (`#202021`, `#161716`) not present in the official digital deck. The brand deck's 6-color chart above is the authoritative, current palette — white is pure `#FFFFFF`, and there are only two accent neutrals besides black/white (Grey `#434242`), not four grays. If you ever encounter `#FEFFFF`, `#202021`, or `#161716` in old assets, treat them as superseded/deprecated, not as additional valid tokens — don't design new UI around them.

**Rules:**
- `#15BB81` is the identity of the brand. Don't substitute a different green, and don't let a new feature introduce an unrelated accent color (blue, purple, orange) as its "own" brand — if a sub-app needs a secondary/status color, pull from a semantic palette (see below), not from a new arbitrary brand hue.
- The two "Secondary" greens are explicitly named as *reflections* of the primary (light-reflected / dark-reflected), tying directly into the logo's diamond-facet symbolism (see § Logo below). Use them as tints/shades of the brand color, not as independent accent colors with their own separate meaning.
- Only 3 accent neutrals exist officially: Black `#0B0B0B`, Grey `#434242`, White `#FFFFFF`. If you need more granularity (e.g. a light gray border, a dark-mode elevated-surface color), interpolate *between* these three rather than picking an arbitrary new gray — see § Dark mode surfaces below for a suggested interpolation.

### Semantic colors — [DEFAULT]

Not specified in the brand deck. Suggested, to be confirmed against the repo:
- Success: reuse `brand-primary` (`#15BB81`) — it's already a "green means good" color, so a separate success green would be redundant and off-brand.
- Warning: a warm amber, used sparingly — for the existing "Beta" / "Coming Soon" badge use case if those badges use semantic color (styling not verified — see `components.md`).
- Error/destructive: a standard red, kept clearly out of the green brand family.
- Info: `brand-secondary-1` (`#8ADDC0`) or `accent-grey` — avoid introducing blue as an "info" color if it can be avoided, to keep the palette green/neutral-dominant.

### Dark mode surfaces — [DEFAULT, built from the official 3 neutrals]

- Page background (dark): `accent-black` `#0B0B0B`
- Card/elevated surface (dark): a step lighter than `#0B0B0B`, interpolated toward `#434242` (e.g. `#161716`–`#1c1d1c` range) rather than a new arbitrary gray
- Border/divider (dark): `accent-grey` `#434242` at reduced opacity
- Primary text (dark mode): `accent-white` `#FFFFFF`
- Secondary/muted text (dark mode): `accent-grey` `#434242` lightened, since `#434242` itself reads as "mid gray on light bg" — on near-black you likely want something lighter. Confirm exact value in repo.
- Page background (light): `accent-white` `#FFFFFF`
- Primary text (light mode): `accent-black` `#0B0B0B`
- Secondary/muted text (light mode): `accent-grey` `#434242`

## Typography

### Typeface — [CONFIRMED — brand deck, slide `04-typography.png`] — **CORRECTED**

The official brand typeface is **Alexandria**, not Poppins. The earlier version of this skill said Poppins based on an OCR misread of the Arabic brand booklet PDF — the brand deck is unambiguous and shows the full weight ramp (Thin → Extra Light → Light → Regular → Medium → Semi Bold → Bold → Extra Bold → Black) for **both Latin and Arabic**, captioned *"A Font has been written in advance to give a stack feeling."*

This matters more than a simple correction: **Alexandria is a single variable font family that natively supports both Latin and Arabic scripts**, unlike Poppins (Latin-only). That changes the i18n guidance too — see `i18n-rtl.md`, which now drops the "pair Poppins with a separate Arabic face" recommendation in favor of using Alexandria for both scripts directly.

- Use **Alexandria** for the entire interface — headings and body, Latin and Arabic — unless the calibration pass finds the real repo pairs it with something else for body copy.
- Full weight range available: Thin (100), Extra Light (200), Light (300), Regular (400), Medium (500), Semi Bold (600), Bold (700), Extra Bold (800), Black (900). The brand deck's own headings/body use a fairly heavy hand (Semi Bold/Bold territory) for emphasis words and headlines, Regular/Medium for body copy — matches the tone of the live site's punchy short headlines.
- It's a real, freely-available Google Font (`Alexandria`) — safe to load via `next/font/google`, a Google Fonts `<link>`, or self-hosted variable font files.

### Type scale — [DEFAULT]

Not measurable without live CSS. Suggested scale consistent with the site's actual heading hierarchy (hero H1 "Your Academic Ecosystem" is clearly the largest, section headers are a clear step down, card titles smaller still):

| Role | Suggested size (desktop) | Weight (Alexandria) |
|---|---|---|
| Hero H1 | ~48–64px | Bold/Extra Bold (700–800) |
| Section H2 | ~32–40px | Semi Bold (600) |
| Card/sub-section H3 | ~20–24px | Semi Bold (600) |
| Body | ~16px | Regular/Medium (400–500) |
| Small/meta (badges, "by X" attribution) | ~12–13px | Medium (500) |

### Voice/microcopy patterns — [CONFIRMED — live site + brand deck]

- Section headlines are short and punchy, often a sentence fragment ending with a beat: *"The only **Stack** you need."*, *"Just the Beginning."*, *"Build the Future With Us."*
- The brand deck itself uses this same construction for every slide title: *"A Logo has been shaped in..."*, *"A Font has been written in advance to..."*, *"An Emerald describes students' value"*, *"The Colors have been collected to give our identity a life"*, *"A Collection of services that each has its own uniqueness"* — a colored keyword (in `brand-primary` green) leads the sentence, followed by plain white text. **This "colored-keyword-leads-the-sentence" pattern is a real, reusable heading style** — consider it for section headers/intros in new UI, not just for the brand deck itself.
- The word "Stack" is used as a pun/wordplay hook wherever possible: "Stacking Solutions, Unlocking Potential" (tagline), "Skill Stacking" (feature name), loading indicator literally reads **"Stacking..."**.
- The brand deck's own mission line: *"It is an initiative by students for their peers, aiming to build a digital system that simplifies the university journey for students, from planning courses to the end of the semester, within a single platform that continually expands its services."* — use this as the canonical "what is KStack" one-paragraph description if a new page needs one (an About page, a meta description, a pitch section), rather than writing a new one from scratch.
- The deck closes with: *"It is not the end — Keep updating to see the latest version of the identity."* — the brand explicitly frames itself as a living, evolving identity, not a frozen spec. Don't treat any single value in this skill (including this deck) as permanently fixed; re-check when newer brand material appears.
- Feature/value descriptions are one short sentence, plainspoken, sometimes slightly cheeky ("Education support shouldn't have a paywall.", "This isn't a corporate project.").
- CTAs are direct and low-friction: "Open Service", "Read More!", "Contact Us", "Log in / Sign in" — not marketing fluff like "Get Started Today →".
- Footer copy has warmth: *"Built with ❤ in Jeddah."*

When writing new copy for KStacks, match this register: confident, short, a little playful, never corporate.

## Logo — [CONFIRMED — brand deck, slide `03-logo-construction.png`]

The KStack mark is a **layered 3D diamond/rhombus stack**, deliberately symbolic, not a decorative shape. Per the brand deck it's built from 3 flat diamond forms that get layered into one 3D mark:

1. **Bottom layer — "The infrastructure we made for our ecosystem"** — dark green (`brand-secondary-2` `#1A6F52`), drawn as an outline/frame in the construction diagram.
2. **Middle layer — "The reflection that shows the interaction between a student and a service"** — white/light, sits between the other two, visually reads as the "connector" facet.
3. **Top layer — "The student who has been valued by using our services" / "The service we made that sees the light for students"** — the top-facing diamond facet is light green (`brand-secondary-1` `#8ADDC0`), with the leading green edge representing "the service."

The finished lockup pairs this diamond mark with the wordmark **"KStack"**, where the **K is always set in `brand-primary` green** and **"Stack" is set in the ambient foreground color** (white text on dark backgrounds, dark/black text on light backgrounds). Confirmed logo-on-background variants from the deck:
- On black background: diamond mark uses the light-green top facet, white "Stack" text, green "K".
- On white background: dark green diamond mark, black "Stack" text, green "K".
- On brand-green background: white/monochrome diamond mark, white "Stack" text (green "K" is dropped/unified to white here since it would disappear against the green background).

There's also a separate **icon-only mark**: a simplified chevron/arrow motif (stacked V-shapes, echoing the layered-diamond construction) used as a compact app-icon-style version — seen in the "hands presenting the mark" emerald-symbolism slide (`05-color-symbolism.png`) and in the closing seal graphic (`08-closing.png`).

**Rules:**
- Never recolor the diamond mark with an arbitrary color scheme — its three facets are tied to specific palette roles (primary/secondary-1/secondary-2) and specific symbolic meanings (student/service/infrastructure). If you need a monochrome version (e.g. a single-color favicon), collapse it to one flat color rather than inventing a new tri-tone combination.
- The K-in-green + rest-in-foreground-color wordmark treatment is the confirmed lockup — don't set the whole "KStack" wordmark in a single flat color, and don't recolor a different letter.
- This confirms and strengthens the earlier guidance in `components.md` about **not using CSS filters to fake a dark-mode logo** — the deck shows the mark is deliberately recomposed per background (different facet gets emphasized/lightened, not just inverted), so a naive filter-invert would misrepresent the actual design intent.

## Service icon family — [CONFIRMED — brand deck, slide `07-service-icons.png`]

The deck shows a family of **6 distinct geometric service icons**, each built from the same sharp-angled, diamond/chevron visual vocabulary as the main logo (not literal/skeuomorphic icons — e.g. not a literal magnifying glass for "search"). Each icon is shown in **4 canonical color contexts**:
1. Brand-green-on-black
2. White-on-black
3. Brand-green-on-white
4. Black-on-white

**Rule for any new service/product icon:** follow this exact 4-variant contract (must legibly render on black, white, and stay on-brand-green where used) and keep the same angular/diamond-based construction language as the existing 6 icons and the main logo — don't introduce a softer, rounded, or illustrative icon style for a new service, since it would visually fracture the family. The exact icon-to-service mapping (which of the 6 marks belongs to kindex vs. kplanner vs. kgroups vs. Grades/KGPA, etc.) isn't labeled in the deck itself — one icon is clearly the **GPA wordmark** (Grades service); confirm the rest against the real logo asset filenames in the repo during calibration (`verification-checklist.md`) rather than guessing.

## Color symbolism — [CONFIRMED — brand deck, slide `05-color-symbolism.png`]

The deck explicitly frames the palette as meaningful, not decorative: *"An Emerald describes students' value."* The green identity is tied to the idea of value/worth being given to students (illustrated with hands presenting the glowing diamond mark). Keep this in mind for tone: the green isn't "a nice SaaS color," it's meant to read as *value delivered to students* — lean into that when writing copy or choosing where to apply the strongest, most saturated green (e.g. on the specific benefit/value being highlighted, not just decoratively everywhere).

## Social handles — [CONFIRMED — brand deck, slide `01-cover.png`] — note a discrepancy

The brand deck's cover slide lists the official org handle as **@KStacksOrg** across **LinkedIn, X, and YouTube**. This differs from what's in the live site's footer (`content-inventory.md`), which links to **github.com/KAUStack** and **x.com/KauIndex**. Both are likely real and simply serve different purposes (an org-level brand account vs. a specific project's dev-facing account) — don't treat this as an error to silently "fix" by picking one. If a new page needs social links, ask which account is appropriate for that context (org-wide brand presence → @KStacksOrg / LinkedIn / YouTube; developer/open-source facing → GitHub/X project accounts) rather than assuming.

## Spacing, radius, shadow, motion — [DEFAULT]

None of these were specified in the brand deck (which covers logo/color/type/icon system, not a full UI spec) or measurable without live CSS/DOM access. Suggested defaults consistent with the site's visual character and the deck's own sharp, geometric, diamond-angle visual language:

- **Spacing scale:** standard 4px-based scale (4/8/12/16/24/32/48/64/96) — nothing suggests a nonstandard scale.
- **Radius:** the brand mark itself is sharp-angled (diamonds, chevrons), which argues for a slightly crisper corner radius than a "soft SaaS" default — suggested `6–8px` for buttons/badges, `10–12px` for cards, rather than very rounded (`16px+`) or fully sharp (`0px`). This is a judgment call blending the live site's card-grid softness with the logo's angularity — confirm against the repo.
- **Shadow:** cards likely use a soft, low-elevation shadow rather than heavy drop shadows. The brand deck's own glow effects around the logo (radiating green glow on the dark cover slide) suggest a soft **glow/halo** treatment (colored box-shadow using `brand-primary` at low opacity) is on-brand for hero/featured moments specifically, separate from ordinary card elevation shadows.
- **Motion:** no animation library was identifiable without DOM access. Default to restrained motion: fade/slide-up on scroll-into-view for section content, quick (150–200ms) hover transitions on cards/buttons. The deck's cover slide has a radiating glow around the mark — a subtle animated glow/pulse on the hero logo (not on every icon) would be a reasonable, tasteful way to bring that specific deck moment into a live UI, without applying it everywhere.

## Breakpoints — [DEFAULT]

Not measurable without live CSS. Assume standard Tailwind-style breakpoints (`sm`/`md`/`lg`/`xl`) until confirmed:
- Mobile: < 640px — single column, service/project cards stack, nav collapses to the confirmed "Toggle menu" hamburger pattern (seen live on groups.kstacks.org).
- Tablet: 640–1024px — 2-column card grids.
- Desktop: > 1024px — 3-column card grids for the "Official Stack Services" style sections (6 services fits a 3×2 or a wrapping flex grid).
