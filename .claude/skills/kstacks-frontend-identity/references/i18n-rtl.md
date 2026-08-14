# KStacks: Arabic/English & RTL/LTR Handling

Confidence key: **[CONFIRMED]** = observed live. **[DEFAULT]** = recommended practice, not verified against repo.

## What's actually confirmed

- **kstacks.org (the marketing/portal site) is English-only** as currently live — no language switcher was found on the homepage. **[CONFIRMED]**
- **grades.kstacks.org (KGPA) is fully Arabic, fully RTL, with no English toggle observed** — headline "حاسبة المعدل التراكمي" ("Cumulative GPA Calculator"), subhead addressed to "لطلاب وطالبات جامعة الملك عبدالعزيز" ("for KAU male and female students"). This is real, live evidence that Arabic-first, RTL-only UI is a legitimate, shipped pattern within the ecosystem — not hypothetical. **[CONFIRMED]**
- **groups.kstacks.org exposes an explicit "Toggle theme" control** (light/dark), confirming theme-switching is a real, working feature elsewhere in the ecosystem. No Arabic/language toggle was observed on that particular sub-app's homepage. **[CONFIRMED]**
- The official brand booklet (KAUStack-1-1.pdf) is written **primarily in Arabic**, targeted at Arabic-speaking university stakeholders, and RTL Arabic typesetting is clearly the norm for that document. **[CONFIRMED]**
- The brand typeface is **Alexandria** (corrected from an earlier "Poppins" guess — see `design-tokens.md`), a variable font that **natively supports both Latin and Arabic glyphs in one family**, per the official brand deck's typography slide (`assets/brand-deck/04-typography.png`), which explicitly shows the full weight ramp rendered in both scripts side by side. **[CONFIRMED — brand deck]** This is good news for i18n: unlike a Latin-only display face, you do not need a separate Arabic font-stack fallback — Alexandria should be able to carry both scripts directly.

## What this means for new work

**Default assumption for any new page or component:** build it bilingual- and RTL-capable from the start, even if the immediate task is English-only, because:
1. The ecosystem already has a fully-Arabic-RTL live surface (grades.kstacks.org).
2. Multiple services target the same KAU student body, most of whom are Arabic speakers, so Arabic support is a plausible near-term requirement for any given service even if not present today.
3. Retrofitting RTL into hardcoded `left`/`right` CSS later is expensive; building it in from the start is nearly free if done with logical properties.

### CSS rules — [DEFAULT, standard practice, apply unless repo shows otherwise]

- Use CSS logical properties, not physical ones: `margin-inline-start` / `margin-inline-end` instead of `margin-left` / `margin-right`; `padding-inline` instead of `padding-left/right`; `inset-inline-start/end` instead of `left/right`; `text-align: start/end` instead of `left/right`. In Tailwind, prefer the logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) over `ml-*`/`mr-*`/`pl-*`/`pr-*`/`left-*`/`right-*` wherever the Tailwind version in the repo supports them (verify in the calibration pass).
- Set `dir="rtl"` (or `dir="auto"`/toggle via `<html dir>`) at the document or locale-root level rather than per-component flipping — let the logical properties do the work.
- Flex/grid direction should follow `flex-direction: row` (which already respects `dir`) rather than manually reversing with `row-reverse` hacks tied to a hardcoded language.

### Typography for Arabic — [CONFIRMED — brand deck]

Because the brand typeface **Alexandria** covers both Latin and Arabic natively (see `design-tokens.md` § Typeface), the correct approach is simpler than a typical bilingual brand: **load the Alexandria variable font with both Latin and Arabic subsets and use it for everything, in both languages** — no separate Arabic font-stack fallback is needed the way it would be for a Latin-only face like Poppins (this skill's earlier, incorrect guess). Just make sure the actual `@font-face`/`next/font` config requests the Arabic unicode range/subset, not just Latin, or Arabic text will silently fall back to a system font even though the brand asset supports it. Confirm in the calibration pass (`verification-checklist.md`) that the real repo's font loading includes the Arabic subset.

Note grades.kstacks.org's actual live font wasn't independently verifiable from a text-only fetch — if it turns out to use a different font than Alexandria, that's a sign that sub-app either predates the current brand deck or was built independently; don't treat it as overriding the brand deck's typeface guidance for new work.

### Icons & imagery — [DEFAULT]

- **Mirror directional icons in RTL** (back/forward arrows, chevrons that imply reading direction, "next/previous" pagination arrows).
- **Do not mirror the brand logos/wordmarks** or numeral-based UI (GPA numbers, course codes) — those stay LTR-oriented regardless of page direction, consistent with how the brand booklet itself keeps "KAUStack"/"KStack" and the K/A/U emphasis as a fixed Latin wordmark even inside an Arabic-language document.
- Badges/status labels ("Beta", "Coming Soon") should get real Arabic translations when localizing a page, not be left in English inside an otherwise-Arabic UI, unless the repo's actual localization approach (once checked) deliberately keeps certain brand/status terms untranslated.

### Numerals & formatting — [DEFAULT]

Arabic UI in this region commonly still uses Western/Hindu-Arabic numerals (0–9) rather than Eastern Arabic-Indic numerals (٠–٩) for things like GPA figures and course numbers — this matches standard KSA university software conventions, but **confirm against the real grades.kstacks.org rendering or repo locale files** before assuming either way, since both conventions exist in the wild.

### Layout consequence checklist for any new page

- [ ] Does the page use logical CSS properties (or Tailwind logical utilities) instead of hardcoded left/right?
- [ ] Do card grids and flex rows reflow correctly under `dir="rtl"` without manual reordering hacks?
- [ ] Is there a real Arabic translation for every user-facing string (not machine-translated at render time as a shortcut)?
- [ ] Does the font loading actually include the Arabic subset/unicode-range for Alexandria (not just Latin), so Arabic text renders in-brand instead of silently falling back to a system font?
- [ ] Are directional icons mirrored, while logos/brand marks and numerals are correctly left un-mirrored?
- [ ] If this page/component will live inside a sub-app that already has a theme toggle (like groups.kstacks.org), does the new UI respect the existing theme state rather than introducing a second, disconnected theme mechanism?
