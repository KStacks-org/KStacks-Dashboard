# KStacks Content Inventory & Information Architecture

Everything below is **[CONFIRMED]** — pulled directly from fetching the live pages. Use this to understand the real rhythm and IA of the site, and to know what already exists so you don't duplicate or contradict it.

## kstacks.org — homepage, section by section

1. **Header/hero**
   - Logo (light + dark SVG pair, `kstack-light.svg` / `kstack-dark.svg`)
   - Tagline: *"Stacking Solutions, Unlocking Potential"*
   - H1: *"Your Academic Ecosystem"*
   - Subhead: *"Access all your student services in one unified platform"*

2. **"Official Stack Services"** — *"Core services built and maintained by the KStack team"*
   Card grid, one card per service, each with: logo (light/dark pair), status badge (if any), service short-name, service tagline, one-line description, CTA.
   - **Index (kindex)** — tagline "Course & Section Search" — *"Find courses and sections with advanced filtering for a powerful searching experience"* — CTA "Open Service" → kauindex.com
   - **Planner (kplanner)** — tagline "Schedule Builder" — *"Plan your semester with visual conflict detection"* — CTA "Open Service" → kauindex.com/planner
   - **Groups (kgroups)** — badge "Beta" — tagline "Student Communities" — *"Find Whatsapp groups based on your own schedule with ease"* — CTA "Open Service" → groups.kstacks.org
   - **Grades (KGPA)** — tagline "GPA Calculator" — *"Calculate your semester and cumulative GPA to track your academic performance"* — CTA "Open Service" → grades.kstacks.org
   - **Devs (kdevs)** — badge "Coming Soon" — tagline "Developer Resources" — *"Learn how to build on the stack, access documentation, and learn for free"* — CTA disabled, reads "Under Development"
   - **Subjects (ksubjects)** — badge "Coming Soon" — tagline "Subject Explorer" — *"Explore subjects, rate, and review them with the community"* — CTA disabled, reads "Under Development"

3. **"Powered by KStack"** — *"Student projects sponsored and supported by our infrastructure"*
   Community-project card grid — distinct from official services (no logo mark, has an author attribution instead):
   - **Schedly** — *"Generate all possible class schedules and pick the best one, using the raw power of algorithms."* — attribution "by Yasir Alghamdi" → schedly.y-tools.xyz
   - **Grade Calculator** — *"GPA and grade prediction tool"* — attribution "by Math Society"
   - **"Your Project Here"** — a placeholder/CTA card: *"The stack is incomplete without you. Build the next essential tool and claim this spot."* — attribution "by You"
   - Below the grid: a callout — H3 *"Want to build with us?"*, subtext *"Get your project featured here with free hosting, infrastructure, and tech support"*, button *"Read More!"*

4. **"The only Stack you need"** — *"Open source by design. Student-first by mission. The infrastructure students deserve."*
   Four value-proposition blocks (icon/heading/one-line description each — no imagery beyond an icon):
   - **Open Source First** — *"KStack is built in the open, we have nothing to hide, and everything to show, every line of code is readable, auditable, and improvable."*
   - **Truly Free, Forever** — *"Education support shouldn't have a paywall. All services are free, forever."*
   - **Smart Sync** — *"Schedules, preferences, and data flow seamlessly across the entire KStack ecosystem in real time. Update once, reflect everywhere."*
   - **A Community Effort** — *"This isn't a corporate project, It's built by your peers who face the same challenges you do every day."*

5. **"Single Sign-On for Everything"** — *"One account. One password. Instant access to every service in the ecosystem."*
   A visual showcase row of the ecosystem's own logos (kstack, kindex, kplanner, kgroups, each with light/dark SVG pairs) plus a "More..." affordance, and a "Log in / Sign in" CTA. This is the section that visually sells the multi-app SSO story.

6. **"For Student Developers" → "Build the Future With Us"** — *"We provide world-class infrastructure, hosting, technical support, and visibility for ambitious student projects."*
   CTA buttons: "Contact Us" and "Download The Booklet" (links to the PDF brand/pitch booklet).
   Four more value blocks (same pattern as section 4, developer-facing this time):
   - **Free Hosting** — *"Spin up containers, host APIs, ship apps without the overhead, and pay absolutely nothing."*
   - **Unified Auth** — *"Stop rebuilding login screens. Use our secure, pre-built student authentication and APIs to ship your features faster."*
   - **Skill Stacking** — *"Don't just code for grades. Ship production software, contribute to open source, and build a portfolio that gets you hired."*
   - **Instant Audience** — *"Skip the marketing struggle. Stack your app on our ecosystem and reach thousands of students Immediately."*

7. **Closing CTA — "Just the Beginning"** — *"Our ecosystem is expanding. More services. More features. More possibilities. Join us on this journey."*
   Logo repeated again (light/dark pair) — book-ends the page with the same brand mark it opened with.

8. **Footer**
   - Logo (light/dark pair)
   - "KStack"
   - "Student-Powered Innovation"
   - "Built by students, for students at King Abdulaziz University"
   - Social links: GitHub (github.com/KAUStack), Twitter/X (x.com/KauIndex)
   - Copyright: *"© 2026 KStack. Built with ❤ in Jeddah."*

9. **Loading state:** the page includes literal loading copy **"Stacking..."** — confirms the brand extends its wordplay even into utility/loading UI, not just marketing copy. Any new loading indicator you add should follow this pattern (on-brand micro-copy) rather than a generic spinner-only state.

## The ecosystem map (ties directly into naming/component conventions)

| Service | Codename | Domain | Status (as of authoring) | Notes |
|---|---|---|---|---|
| Index | kindex | kauindex.com | Live | Course & section search. Site renders as a client-side SPA (fetched page showed only "Loading…" with no server-rendered content) — likely React/similar, separate deploy from the marketing site. `theme-color` meta is `#ffffff`. |
| Planner | kplanner | kauindex.com/planner | Live | Schedule builder, lives under the kindex domain as a sub-route, not a separate domain. |
| Groups | kgroups | groups.kstacks.org | Live, "Beta" | WhatsApp-group finder. Confirmed to have a **light/dark theme toggle** and a **mobile menu toggle** — real, working component patterns you can point to. Has an "About" page (groups.kstacks.org/about). |
| Grades | KGPA | grades.kstacks.org | Live | GPA calculator. **Fully Arabic, RTL interface**, no English toggle observed. Appears to be independently built/attributed (different contact handle in its footer than the main KStack socials) — treat it as a real ecosystem data point for "Arabic/RTL is used in this ecosystem," but not necessarily as the canonical component-library reference the way groups.kstacks.org is. |
| Devs | kdevs | — | "Coming Soon" | Not yet live. |
| Subjects | ksubjects | — | "Coming Soon" | Not yet live. |

**Naming convention:** every official service uses a lowercase `k` prefix + the service's plain-English function (kindex, kplanner, kgroups, kdevs, ksubjects), except Grades, which is branded "KGPA" (uppercase). If asked to name a brand-new service, follow the lowercase-`k`-prefix pattern (e.g. `kjobs`, `ktutors`) unless there's a strong reason to deviate the way Grades/KGPA did.

## Brand booklet (kstacks.org/KAUStack-1-1.pdf)

An Arabic-language pitch/brand booklet aimed at university stakeholders and sponsors. Contents relevant to frontend work:
- States the mission ("a single platform that grows service by service"), goals (technical support, faster quality via code review, guidance, engineering, clear standards), and what they offer (helping student projects get built, published, and gain real usage inside the university environment).
- States the brand identity page explicitly ("انتيوه" — "Our Identity") with the 8 confirmed hex colors and the Poppins typeface (see `design-tokens.md`).
- Shows the "KAU" letters emphasized differently within the "KAUStack" wordmark (K-A-U called out, since KAU = King Abdulaziz University) — if you ever typeset the full "KAUStack" wordmark (not just "KStack"), consider preserving that K/A/U emphasis rather than treating it as one flat word.
- Lists each official service with a features/one-liner in Arabic, matching the English copy on kstacks.org closely (KAUIndex, KAUPlanner, KAUGroups) — confirms the English site copy is the canonical version to build from for UI work, with the booklet as a secondary Arabic-language source.
- Lists the founding team.

This booklet is a useful thing to point back to for mission/pitch copy and team history, but **it is not the authoritative source for exact colors and typeface** — see the note below.

## Official brand deck (`assets/brand-deck/`) — the authoritative visual-identity source

The KStack team separately provided a proper "KStack Visual Identity" slide deck (8 slides, saved as images at `assets/brand-deck/01-cover.png` through `08-closing.png`). **This deck supersedes the printed brand booklet PDF for anything about colors, typography, and the logo/icon system** — the booklet's OCR-derived numbers turned out to be imprecise/outdated (it listed white as `#FEFFFF` and extra grays not in the finalized 6-color palette; it also didn't clearly establish the typeface, which was mis-read as "Poppins" when the deck confirms it's actually **Alexandria**). Full details on colors, logo construction, icon family, and typography now live in `design-tokens.md`, all tagged `[CONFIRMED — brand deck]`.

Deck contents, slide by slide:
1. `01-cover.png` — Title card: "KStack — Visual Identity", the finished logo lockup, social handles (@KStacksOrg on LinkedIn/X/YouTube).
2. `02-intro.png` — Wordmark + mission paragraph (see the canonical mission copy quoted in `design-tokens.md` § Voice) alongside a construction-motif graphic.
3. `03-logo-construction.png` — The logo-construction diagram: 3 diamond forms → layered 3D mark, each layer symbolically labeled (student / service / infrastructure / reflection), plus the confirmed logo-on-background variants (white bg, black bg, green bg).
4. `04-typography.png` — Typography slide: **Alexandria**, full weight ramp (Thin→Black), shown in both Latin and Arabic.
5. `05-color-symbolism.png` — "An Emerald describes students' value" — symbolic framing of the green identity (hands presenting the glowing mark).
6. `06-colors.png` — The finalized 6-color palette chart with exact HEX/RGB/CMYK and official role names (Primary, Secondary 01/02, Accent 01/02/03).
7. `07-service-icons.png` — The 6-icon service mark family, each shown in 4 background/color variants.
8. `08-closing.png` — Closing note: "It is not the end — keep updating to see the latest version of the identity," with a seal/badge graphic.

Treat the printed booklet PDF as a secondary, mission/pitch-oriented source and the live site as the primary source for page structure and English copy — but for the **visual identity itself** (colors, type, logo, icons), always defer to this deck first.
