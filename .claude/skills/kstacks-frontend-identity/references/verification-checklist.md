# Calibration Checklist — Run This Once Inside the Real KStacks Repo

This skill was authored by inspecting the **live site**, the **official KStack Visual Identity brand deck** (`assets/brand-deck/`), and the **printed brand booklet PDF**, without access to the actual KStacks codebase (no repo was mounted in the environment where this skill was written). Everything marked **[CONFIRMED — brand deck]** or **[CONFIRMED — live site]** in the other reference files is solid (colors, font, logo construction, icon system, copy, IA, component inventory). Everything marked **[DEFAULT]** is a reasonable placeholder that needs a quick confirm-or-correct pass against real source.

Do this the first time you use this skill inside an actual KStacks/kindex/kplanner/kgroups project, and whenever the skill seems to disagree with what you find in the repo — **the repo always wins.** Update the reference files afterward so this skill improves over time instead of staying static.

## 1. Design tokens (`design-tokens.md`)

- [ ] Find the Tailwind config (`tailwind.config.js`/`.ts`) or CSS variables file (`globals.css`, `theme.css`, a `:root { --... }` block, or a CSS-in-JS theme object) and confirm:
  - Do the actual color tokens match the 6 confirmed brand-deck hexes (`#15BB81`, `#8ADDC0`, `#1A6F52`, `#0B0B0B`, `#434242`, `#FFFFFF`), or has the palette evolved since the deck was made? Update `design-tokens.md`'s table with real token names (e.g. `--brand-500`) if named differently.
  - What are the actual dark-mode surface/text mappings?
  - What's the real spacing scale, border-radius values, and shadow tokens?
  - What breakpoints are actually configured?
- [ ] Grep for `font-family` / check `next/font`, `@font-face`, or a Google Fonts `<link>` to confirm **Alexandria** is loaded (not Poppins — that was a corrected earlier mistake in this skill), what weights are actually included, and whether the Arabic subset/unicode-range is loaded alongside Latin.
- [ ] Check for an animation library in `package.json` (Framer Motion, GSAP, `tailwindcss-animate`, CSS-only) to confirm real motion patterns instead of the § Motion defaults.
- [ ] Locate the real logo SVG assets (light/dark/green-bg variants) and the 6 service icon files, and confirm which icon belongs to which service (kindex/kplanner/kgroups/Grades-KGPA/kdevs/ksubjects) — the brand deck shows the icon family but doesn't label the mapping. Record the mapping in `design-tokens.md` § Service icon family once known.

## 2. Components (`components.md`)

- [ ] Find the actual component directory (e.g. `components/`, `src/components/ui/`) and identify the real Service Card, Project Card, Value Block, Badge, and Button components/files. Note their real prop shapes so future work can reuse them directly instead of re-deriving from the marketing-page description.
- [ ] Confirm the actual icon library in use (`lucide-react`, `heroicons`, custom SVGs, etc.) — this skill's default guess (a modern line-icon set) needs a real answer here.
- [ ] Confirm the real button variant system (how many tiers, what they're called, whether there's an "outline" variant beyond primary/secondary/link).
- [ ] Confirm the real badge component's color logic for `Beta` vs `Coming Soon` vs any other states.
- [ ] Locate the real theme-toggle and mobile-menu-toggle components (known to exist, per groups.kstacks.org) and note their implementation so new pages can reuse them rather than reinventing.

## 3. i18n/RTL (`i18n-rtl.md`)

- [ ] Identify the actual i18n approach in use (e.g. `next-intl`, `i18next`, a custom dictionary, or per-route Arabic pages like grades.kstacks.org appears to be) and where translation strings live.
- [ ] Confirm the real repo actually loads Alexandria's Arabic subset for Arabic text (rather than a separately-paired Arabic font or an unintended system-font fallback).
- [ ] Confirm whether Western or Eastern Arabic-Indic numerals are used in the real Arabic UI.
- [ ] Confirm whether Tailwind logical utilities (`ms-*`/`me-*`/`ps-*`/`pe-*`/`start-*`/`end-*`) are already the convention in the codebase, or whether RTL is handled a different way (e.g. a `[dir="rtl"]` CSS override block, or per-locale component variants).

## 4. Stack fundamentals (not covered elsewhere)

- [ ] Confirm the actual frontend framework/meta-framework (React/Next.js/Vite/etc.) and rendering strategy (kauindex.com appeared to be a client-rendered SPA from a static text fetch — confirm whether that's Next.js CSR, plain Vite+React, or something else).
- [ ] Confirm the styling approach (Tailwind utility classes vs. CSS Modules vs. styled-components vs. a component library like shadcn/ui) so new components match the existing authoring pattern exactly, not just the visual result.
- [ ] Confirm whether the marketing site (kstacks.org) and the sub-apps (kindex/kplanner/kgroups/grades) share a component library/monorepo, or are genuinely separate codebases with their own (possibly drifted) implementations of "the same" design system. This materially changes where a new shared component should live.

## After calibrating

Update the `[DEFAULT]` items in `design-tokens.md`, `components.md`, and `i18n-rtl.md` with the real, confirmed values, and flip their confidence tag to `[CONFIRMED]`. Leave a short note of what changed and when, so the skill keeps getting more accurate rather than silently drifting from the real codebase over time.
