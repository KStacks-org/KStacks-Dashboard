---
name: kstacks-frontend-identity
description: Use this skill for ANY frontend/UI work on KStacks (kstacks.org) or its service ecosystem (kindex/KauIndex, kplanner, kgroups, kgpa/Grades, kdevs, ksubjects) — building new pages, designing new components, redesigning existing screens, writing marketing copy blocks, building service/project cards, dashboards, forms, or auth screens. Always consult this skill before writing any HTML/CSS/JSX/Tailwind for KStacks so the output matches the real brand (Alexandria font, #15BB81 emerald-green identity, the layered-diamond logo system, light/dark logo-swap theming, card-grid service catalog, bilingual Arabic/English + RTL/LTR support) instead of generic UI. Trigger on mentions of "KStack", "KAUStack", "kindex", "KauIndex", "kplanner", "kgroups", "kgpa", the KStack portal, or "match the KStacks design/brand/style".
---

# KStacks Frontend Identity

KStacks (kstacks.org) is the marketing/portal site for **KAUStack**, a student-run ecosystem of free academic tools ("kindex", "kplanner", "kgroups", "kgpa/Grades", "kdevs", "ksubjects") for King Abdulaziz University (KAU) students in Jeddah, Saudi Arabia. It positions itself as open-source, free-forever, community-built infrastructure — and the UI should always read as **student-built-but-professional**: clean, confident, slightly playful copy, never corporate-stiff, never sloppy.

## Sources of truth (read this before trusting the details below)

This skill was built from three sources, ranked by authority:

1. **The official "KStack Visual Identity" brand deck** (8 slides, saved as images at `assets/brand-deck/`) — provided directly by the KStack team. This is the **most authoritative source** for colors, typography, the logo/icon system, and brand voice patterns. It **supersedes** the other two sources wherever they conflict — for example, it corrected an earlier draft of this skill that had the wrong typeface (Poppins) and slightly wrong color values, both sourced from OCR of an older printed booklet.
2. **The live site** (kstacks.org and its sub-apps groups.kstacks.org, grades.kstacks.org, kauindex.com) — the primary source for page structure, information architecture, and actual English copy.
3. **The printed KAUStack brand booklet PDF** (kstacks.org/KAUStack-1-1.pdf) — a secondary, mission/pitch-oriented Arabic document. Useful for mission copy and team history; **not reliable** for exact colors/typography (see correction in `design-tokens.md`).

This skill was **not** built from an actual project repo, because no KStacks codebase was present in the environment where this skill was authored.

That means two tiers of information live in this skill:

1. **Confirmed facts** (colors, font, logo construction, service icon system, copy, information architecture, component inventory, badge states, dark/light logo swapping, bilingual behavior) — pulled directly from the brand deck and the live site. Treat these as ground truth, deck-sourced facts taking priority over live-site inference if they ever conflict.
2. **Recommended implementation defaults** (exact Tailwind config, spacing scale, radii, shadows, animation durations, breakpoints, icon library beyond the brand marks) — reasonable choices consistent with tier 1, but *not* verified against real CSS/DOM because that requires a live browser or repo access this authoring session didn't have.

**The first time this skill is used inside the real KStacks codebase, do the calibration pass in `references/verification-checklist.md` before designing anything.** It's a 5-minute grep-and-read pass (tailwind.config, globals.css, package.json, a real component or two) that upgrades tier-2 defaults to tier-1 facts. Update the reference files with anything that turns out different — this skill should get more accurate every time it's used, not stay static.

## Quick identity summary

- **Font:** Alexandria — the confirmed official typeface (per the brand deck), a variable font that natively covers both Latin and Arabic in one family. Use it for everything, headings and body, both languages, unless the calibration pass finds a body/heading split in the real repo.
- **Color:** Emerald/teal green `#15BB81` is the brand color, not a generic SaaS blue or purple. Full 6-color official palette (Primary, Secondary 01/02, Accent Black/Grey/White) in `references/design-tokens.md`.
- **Logo:** a layered 3D diamond mark, each facet symbolically meaningful (student/service/reflection/infrastructure) — not decorative geometry. See `references/design-tokens.md` § Logo before touching any brand mark.
- **Tone:** Confident but scrappy. Copy leans on short punchy fragments ("Truly Free, Forever.", "Just the Beginning.") and a wordplay-heavy brand voice built around the word "Stack" (Stacking Solutions, "Stack the future", loading state literally says "Stacking...").
- **Structure:** Marketing-site-style landing page — hero → service catalog (cards) → community/student-project catalog (cards) → value props (icon+text blocks) → SSO/ecosystem showcase → developer-recruitment CTA section → closing CTA → footer. Not a dashboard-first product; it's the front door to several separate apps.
- **Multi-app reality:** kstacks.org itself is English-only. The tools it links to (kindex/KauIndex, kplanner, kgroups, grades) are separate deployments — some are React SPAs (kauindex.com), some are fully Arabic/RTL (grades.kstacks.org), and at least one exposes a light/dark theme toggle and mobile menu toggle (groups.kstacks.org). **Any shared component library or design system work should assume it needs to work in both LTR/English and RTL/Arabic contexts**, even though the flagship marketing page doesn't currently show a language switcher itself.
- **Dark mode:** Confirmed real, and NOT done by just inverting colors — logos ship as separate light/dark SVG pairs (`kstack-light.svg` / `kstack-dark.svg`, same pattern for kindex/kplanner/kgroups) and both variants are present in the DOM with visibility toggled by theme. Assume this dual-asset pattern for any brand-mark usage, not CSS filters on a single logo file.

## What to do for common tasks

**Building a new page for kstacks.org or a sub-app:**
1. Read `references/content-inventory.md` to understand the real page structure and section order, and mirror its rhythm (short punchy section headline → one-line subhead → grid or block content → occasional CTA banner).
2. Read `references/design-tokens.md` for color/type/spacing and apply it — don't invent a new palette or font.
3. Read `references/components.md` and reuse the closest existing pattern (service card, project card, feature block, CTA banner, badge) instead of inventing a new component shape.
4. Read `references/i18n-rtl.md` if the page needs Arabic content, RTL layout, or a language switcher.
5. Run through the "would look inconsistent" list at the bottom of `components.md` before finishing.

**Redesigning/editing an existing screen:** same as above, but bias toward the *smallest* change that fits the identity — this is a lean student project, not an agency rebrand. Don't introduce a new font, a new accent color, a new card shape, or a new icon set as a side effect of an unrelated task.

**Building a new component (e.g. a settings panel, an auth form, a dashboard widget) that doesn't have a direct precedent on the marketing site:** read `references/components.md` § "Designing new components that don't exist yet" — it gives the derivation rules (how to extrapolate radius/spacing/motion/tone from what *does* exist) rather than a literal template to copy.

**Anything involving Arabic text, RTL layout, or a language toggle:** always read `references/i18n-rtl.md` — this is the area most likely to be gotten wrong (logical CSS properties vs. hardcoded left/right, making sure the Arabic subset of Alexandria is actually loaded, number/date formatting, mirroring icons vs. not mirroring logos).

## Reference files

- `assets/brand-deck/` — the 8 slide images of the official visual identity deck (colors, logo construction, typography, icon family) — open these directly when you need to see the exact visual reference.
- `references/design-tokens.md` — color palette (confirmed official hexes/RGB/CMYK + suggested light/dark surface scale), typography (Alexandria usage, suggested type scale), logo construction and rules, service icon family, spacing/radius/shadow/motion defaults, breakpoints.
- `references/content-inventory.md` — full section-by-section breakdown of kstacks.org as observed live, including exact section headlines/subheads, copy tone patterns, and the sub-app ecosystem (kindex, kplanner, kgroups, kgpa, kdevs, ksubjects, plus community projects like Schedly).
- `references/components.md` — component inventory (service card, community-project card, "your project here" CTA card, feature/value block, badge, primary/secondary button, nav, footer, logo showcase, loading state) with structure, states, and rules for designing new components in-family. Also lists frontend anti-patterns to avoid.
- `references/i18n-rtl.md` — how Arabic/English and RTL/LTR should be handled across the ecosystem, based on confirmed evidence from grades.kstacks.org (full Arabic/RTL) and groups.kstacks.org (theme + menu toggles).
- `references/verification-checklist.md` — the calibration pass to run once inside the real repo, to convert this skill's "recommended defaults" into confirmed, repo-sourced facts.
