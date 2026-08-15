# KStacks Dashboard

Internal dashboard for the KStacks team: task management, a service catalogue the team documents itself, live health monitoring for everything we run, and a register of the student projects we sponsor.

Built to the KStack visual identity: Alexandria typeface, the emerald `#15BB81` brand green, the layered-diamond mark, dark-only theme, and full Arabic/English + RTL/LTR support.

---

## Architecture

```
dashboard/
├── backend/            Express + TypeScript API
│   ├── prisma/         Schema, migrations, seed
│   ├── scripts/        Service sync + E2E fixtures
│   ├── src/
│   │   ├── config/     Environment validation (fails fast)
│   │   ├── controllers/ HTTP layer — parse, delegate, respond
│   │   ├── services/   Business logic + database access
│   │   ├── routes/     Route tables
│   │   ├── middleware/ Auth, CSRF, sessions, rate limits, errors
│   │   ├── validation/ Zod schemas for every external input
│   │   ├── errors/     Typed application errors
│   │   └── utils/      Password hashing, helpers
│   └── tests/          Vitest + Supertest integration tests
└── frontend/           React 19 + Vite + TypeScript
    ├── e2e/            Playwright end-to-end tests
    ├── messages/       en.json / ar.json translation sources
    └── src/
        ├── components/
        │   ├── ui/      shadcn/ui primitives (new-york style)
        │   ├── brand/   KStack logo + "Stacking..." loader
        │   ├── layout/  Header, language toggle
        │   ├── tasks/   Cards, board, calendar, subtasks, comments, links
        │   ├── services/ Service status + health badges
        │   ├── projects/ Sponsored-project form
        │   └── shared/  Empty + error states
        ├── hooks/       Auth and task mutations
        ├── lib/         API client, queries, types, formatting, i18n
        └── routes/      File-based routes (TanStack Router)
```

**Separation of concerns:** the browser never touches PostgreSQL. All database access goes through the backend, which validates every input with Zod before it reaches a query.

### Stack

Chosen to match the conventions already used in the KStacks organisation (`github.com/KStacks-org/portal-frontend`), so this project reads like the rest of the ecosystem.

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS v4 |
| Routing / data | TanStack Router (file-based), TanStack Query |
| Components | shadcn/ui (`new-york`, base colour `zinc`, `lucide-react` icons) |
| Drag & drop | dnd-kit (subtask reordering, board columns) — keyboard accessible |
| i18n | Paraglide JS (`@inlang/paraglide-js`) |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL via Prisma (migrations + typed client) |
| Auth | Server-side sessions in PostgreSQL (`express-session` + `connect-pg-simple`) |
| Passwords | Argon2id |
| Validation | Zod (backend), mirrored in the UI |
| Lint/format | Biome |
| Tests | Vitest + Supertest (API), Playwright (E2E) |
| Package manager | pnpm workspaces |

---

## What's in it

### Tasks

- **Three views over one dataset** — list, kanban board, and month calendar. Switching never refetches.
- **Search and filters** — free text (title, description, `KS-42`, service, assignee), plus service / priority / status / person, "overdue only" and **"My tasks"**. Filtering happens client-side over the already-loaded list, so it is instant.
- **Quick add** — type a title, press Enter. It is assigned to you; open it later for the detail.
- **Workflow status** — `To do` / `In progress` / `Blocked`. Finishing a task **archives** it rather than adding a permanently-empty "Done" column.
- **Task references** — every task gets a short handle like `KS-42` to quote in chat instead of a long title.
- **Read without switching modes** — the card chevron opens a read-only panel showing the subtasks, links and the latest comments in place. Adding to any of them stays in the detail dialog, so viewing and authoring are separate.
- **Subtasks** — drag-to-reorder, and each can be **owned by one person**, who must already be an assignee of the parent task. Removing someone from a task while they still own subtasks is refused, and the error names who to reassign first.
- **Comments** — an async thread per task. Anyone can comment; only the author can edit or delete their own.
- **Links** — attach a PR, doc, or design. Only `http`/`https` are accepted, so a `javascript:` URL can never be stored and later clicked.

### Services

A page per KStack service showing what it is, who owns it, its repository, its open tasks, and its recent health. The **overview** is a free-text writeup the team authors themselves — an internal explainer so anyone can pick the service up. The public catalogue fields (name, tagline, description, status, URL) mirror kstacks.org and are refreshed by the sync script, which never touches the team-authored fields.

### Health

Background probes of every service that has a health-check URL, recorded with status code and response time. The board shows current state, uptime ratio, a history strip, and an on-demand "Check now". Probes run on an interval inside the API process (six services every few minutes does not justify a separate worker); overlapping runs are skipped and history older than 14 days is pruned.

### Sponsored projects

The internal counterpart to the public "Powered by KStack" section: which student projects we support, who runs them, what infrastructure we gave them, and where each one is in the pipeline (`Proposed → In review → Active → Launched → Archived`).

## Requirements

- **Node.js 20+** (developed on 24)
- **pnpm 10+** — `npm install -g pnpm`
- **PostgreSQL 14+** — reachable from wherever the backend runs

---

## Installation

```bash
pnpm install
```

This installs both workspace packages and generates the Prisma client.

---

## Environment configuration

Two `.env` files, neither committed. Copy the examples and fill them in:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env    # optional; only for split-origin deploys
```

### `backend/.env`

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string. URL-encode special characters in the password (`@` → `%40`). |
| `PORT` | no (4000) | Port the API listens on. |
| `NODE_ENV` | no (development) | `production` on the server. Controls secure cookies, logging, and error detail. |
| `APP_URL` | yes | Public URL of the API. |
| `FRONTEND_URL` | yes | Public URL of the frontend — used for the CORS allow-list. |
| `SESSION_SECRET` | yes | ≥32-character random string signing session cookies. |
| `LOGIN_RATE_LIMIT_MAX` | no (10) | Login attempts per IP per window. Leave at the default in production. |
| `LOGIN_RATE_LIMIT_WINDOW_MINUTES` | no (15) | Rate-limit window length. |
| `HEALTH_CHECK_ENABLED` | no (true) | Set `false` to stop the background service probes. |
| `HEALTH_CHECK_INTERVAL_MINUTES` | no (5) | Minutes between probe runs. |
| `SESSION_COOKIE_DOMAIN` | no (host-only) | Set to `.kstacks.org` to share the session across KStack subdomains. Must stay empty in development — a browser rejects such a cookie from `localhost`. |
| `ALLOWED_EMAIL_DOMAINS` | no (`stu.kau.edu.sa`) | Comma-separated email domains permitted to sign in. |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**The API refuses to start** if a required variable is missing or malformed, and prints exactly which one. It never falls back to an insecure default.

### `frontend/.env`

`VITE_API_BASE_URL` — leave **empty** unless the frontend and API are served from different origins. In development Vite proxies `/api` to `localhost:4000`; in production, reverse-proxying `/api` to the backend behind one domain is recommended (and is what makes `SameSite=Lax` session cookies work).

---

## PostgreSQL setup

Create a database and a role that owns it:

```sql
CREATE DATABASE "kstackDashboard";
CREATE USER kstacks WITH ENCRYPTED PASSWORD 'a-strong-password';
GRANT ALL PRIVILEGES ON DATABASE "kstackDashboard" TO kstacks;
```

Then point `DATABASE_URL` at it.

---

## Migrations

```bash
pnpm db:migrate           # development: create + apply a migration
pnpm db:migrate:deploy    # production/CI: apply committed migrations only
```

`pnpm db:migrate:deploy` is the command to run **on every deployment**, before starting the server. It never prompts and never resets data.

Migrations live in `backend/prisma/migrations/` and are committed. A fresh database goes from empty to correct with `db:migrate:deploy` followed by `db:seed`.

---

## Seeding

```bash
pnpm db:seed
```

Creates the eight team accounts and the six KStack services. The seed is **idempotent** — it upserts by `username` / `codename`, so running it repeatedly never creates duplicates and never resets a password that a user has already changed.

It also fills in a default health-check URL for each live service, but only where one has never been set, so a URL the team chose is never overwritten. Service overviews, owners and repository links are always left alone.

### Initial accounts

People sign in with their **university email**. The roster in `backend/prisma/seed.ts` *is* the allowlist — there is no public sign-up, so an address that is not on it cannot get in.

| Display name | Email |
|---|---|
| طارق | *pending* |
| ياسر العوفي | *pending* |
| فواز عبد الله | *pending* |
| محمد خياط | *pending* |
| أمجد القاسمي | *pending* |
| عبد العزيز | *pending* |
| ياسر | *pending* |
| عبدالله السيروان | `aalserawan@stu.kau.edu.sa` |

**Accounts marked *pending* cannot sign in yet.** They are seeded with an address on `pending.invalid` — a reserved TLD (RFC 2606) that can never be a real mailbox — so a placeholder can never accidentally admit an unrelated KAU student. Those accounts still work as task assignees.

### Authorising someone

1. Put their real address in the `USERS` roster in `backend/prisma/seed.ts`.
2. Run `pnpm db:seed`.

Rows are matched on the internal `username` key, so correcting an email updates the existing person rather than creating a second account, and their tasks and assignments are preserved. The seed prints who is still pending on every run.

The two people whose names involve "ياسر" have separate database ids and distinct emails; display name is never used as a key.

### Temporary password

Every seeded account starts with the temporary password:

```
123456
```

Only its **Argon2id hash** is stored — the plaintext is never written to the database, and hashes are never returned by any API response.

### Forced password change

Seeded users are created with `must_change_password = true`. On first login they are redirected to the change-password screen and **cannot reach any dashboard route or call any data API** until they set a new one (the backend rejects those requests with `MUST_CHANGE_PASSWORD`, so the block cannot be bypassed from the browser).

Changing the password requires the current password, a new password, and a confirmation. New passwords must be at least 8 characters and contain a letter and a digit. On success `must_change_password` becomes `false` and **the old password stops working immediately**.

---

## Development

```bash
pnpm dev
```

Starts the API on `http://localhost:4000` and the frontend on `http://localhost:5173` in one command. Vite proxies `/api` to the backend, so there is nothing else to configure.

Individually, if needed:

```bash
pnpm --filter backend dev
pnpm --filter frontend dev
```

---

## Build and production start

```bash
pnpm build     # compiles the API to backend/dist and the frontend to frontend/dist
pnpm start     # runs the compiled API (node dist/src/server.js)
```

Serve `frontend/dist` as static files from your web server (nginx, Caddy, …) and reverse-proxy `/api` to the backend process.

### Deployment checklist

1. Pull the release and run `pnpm install`.
2. Fill in `backend/.env` with production values (`NODE_ENV=production`).
3. Run `pnpm db:migrate:deploy`.
4. Run `pnpm db:seed` — only needed the first time, but safe to repeat.
5. Run `pnpm build`.
6. Start the API with a process manager (systemd, pm2) using `pnpm start`.
7. Serve `frontend/dist` and proxy `/api` to the API.
8. **Terminate TLS in front of the app.** In production, session cookies are issued with the `Secure` flag, so they will not be sent over plain HTTP.

The app sets `trust proxy` when `NODE_ENV=production`, so a reverse proxy in front of it is expected and rate limiting sees real client IPs.

---

## Testing and checks

```bash
pnpm test           # backend integration tests (Vitest + Supertest)
pnpm test:e2e       # Playwright end-to-end tests
pnpm lint           # Biome
pnpm typecheck      # TypeScript, both packages
pnpm build          # production build of both packages
```

`pnpm test` runs against a **real PostgreSQL database** using `DATABASE_URL`. It creates and removes its own throwaway records and never touches the seeded team accounts.

`pnpm test:e2e` needs the app running (`pnpm dev`) and provisions its own `e2e.*` accounts via `backend/scripts/e2e-fixtures.ts`, removing them afterwards. Because the suite performs many logins from one address, run the backend with a raised limit for that session:

```bash
LOGIN_RATE_LIMIT_MAX=500 pnpm dev      # terminal 1
pnpm test:e2e                          # terminal 2
```

---

## KStacks service synchronisation

Tasks can be tagged with a KStack service. Services live in the `services` table — **normal page loads never touch the network**, they read from PostgreSQL.

The catalogue is populated two ways:

1. `pnpm db:seed` — writes the six current services.
2. `pnpm --filter backend db:sync-services` — refreshes them from the live site.

### How the sync works

`backend/scripts/sync-services.ts` fetches `https://kstacks.org/` over plain HTTP (the page is server-rendered, so no headless browser is needed), splits the markup on service-card boundaries, and reads each card's:

- **codename** from its logo asset path (`/projects/kindex-light.svg` → `kindex`) — the most stable identifier on the page, unaffected by copy edits
- **name, tagline, description** from the card's heading and paragraphs
- **status** from its *visible* badge — badges hidden with a `hidden` class are ignored, because the live Grades card ships a hidden "Beta" badge that would otherwise mislabel it
- **URL** from the card's outbound link

Preview before writing:

```bash
pnpm --filter backend db:sync-services -- --dry-run
```

**Safety properties:** if the fetch fails or zero services parse, the script exits non-zero and writes nothing — a redesign of kstacks.org can never wipe the table. Services that disappear upstream are kept rather than deleted, since existing tasks reference them. Run it manually or from cron; it is never on a request path.

If the markup changes shape, the script tells you so and points at the selectors to update.

---

## Security

- **Passwords**: Argon2id (memory-hard, not reversible). Never stored or logged in plaintext; hashes are stripped from every API response.
- **Sessions**: server-side, stored in PostgreSQL. The cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in production, and expires after 7 days. No token is ever placed in `localStorage`.
- **Cookie scope**: controlled by `SESSION_COOKIE_DOMAIN`. Left empty the cookie is host-only (the dashboard alone). Set to `.kstacks.org` it is shared across KStack subdomains — convenient, but it also means the session cookie is sent to *every* host under `kstacks.org`, so each of them has to stay trusted. Pick deliberately.
- **Who can sign in**: three distinct outcomes, so nobody wastes time on the wrong problem — an address off the allowed domain is rejected by validation, an allowed-domain address nobody on the roster owns returns `EMAIL_NOT_ALLOWED`, and a rostered address with a bad password returns the usual generic failure.
- **Session fixation**: the session id is regenerated on login.
- **CSRF**: double-submit token required on every state-changing request.
- **Rate limiting**: strict on login (10 per 15 min per IP), plus a general API limit.
- **Headers**: Helmet defaults.
- **CORS**: locked to `FRONTEND_URL`, credentials enabled.
- **SQL injection**: all access goes through Prisma's parameterised queries; there is no raw SQL.
- **Input validation**: every route validates body, params, and query with Zod before touching the database. Malformed UUIDs and unknown foreign keys are rejected.
- **Error handling**: stack traces, SQL errors, and database internals are logged server-side and never returned to clients.
- **Logging**: pino, with cookies, authorization headers, and password fields redacted.

### Permissions model

Everyone on the team has equal permissions by design — there are no roles.

- Anyone can create tasks and subtasks, and edit any task.
- Everyone sees every task.
- **Only the person who created a task can delete it**, and deletion always requires confirmation. This is enforced on the server, not just hidden in the UI.
- **Only the author of a comment can edit or delete it** — likewise enforced server-side.
- A subtask can only be owned by someone already assigned to its parent task.
- Finishing a task **archives** it. Archived tasks move to the Archive page and are never removed automatically; they can be restored at any time.

---

## Internationalisation

The interface ships in **English and Arabic**, switchable from the header. Switching flips `<html dir>` between `ltr` and `rtl`; layout follows automatically because the UI is built with Tailwind's logical utilities (`ms-*`, `pe-*`, `start-*`) rather than hardcoded left/right.

- Alexandria carries both scripts, so Arabic text stays on-brand instead of falling back to a system font.
- User-entered text (task titles, descriptions, subtasks, names) is rendered with `dir="auto"`, so an Arabic title inside the English UI — or an English one inside the Arabic UI — reads correctly instead of having its mixed Latin/Arabic runs reordered.
- Directional icons mirror under RTL; the KStack mark and numerals do not.
- Arabic uses Western digits (0–9), matching KSA university software convention.

Translations live in `frontend/messages/en.json` and `ar.json`. Adding a key to both files makes it available as `m.your_key()`.

---

## Notes

- The theme is **dark only** in this version; the design tokens are structured so a light theme can be added later without touching components.
- Subtasks are one level deep by design.
- The board has no "Done" column: finishing a task archives it, so a Done column would always render empty.
- Health probes issue a plain `GET` and treat any non-2xx/3xx response or timeout as down. They do not follow up with a body check, so a service returning `200` while broken internally would still read as up.
- There is no self-service password reset. To reset an account, have an admin update its hash directly, or delete the row and re-run `pnpm db:seed` to recreate it with the temporary password.
