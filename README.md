# KStacks Dashboard

Internal task-management dashboard for the KStacks team — a private tool for tracking work across the KStack service ecosystem (kindex, kplanner, kgroups, KGPA, kdevs, ksubjects).

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
        │   ├── tasks/   Task cards, form, calendar, subtasks
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

### Initial accounts

| Display name | Username |
|---|---|
| طارق | `tariq` |
| ياسر العوفي | `yasser.alawfi` |
| فواز عبد الله | `fawaz.abdullah` |
| محمد خياط | `mohammed.khayyat` |
| أمجد القاسمي | `amjad.alqasimi` |
| عبد العزيز | `abdulaziz` |
| ياسر | `yasser` |
| عبدالله السيروان | `abdullah.sayrawan` |

The two people whose names involve "ياسر" get distinct usernames (`yasser.alawfi` and `yasser`) and separate database ids; display name is never used as a key.

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
- There is no self-service password reset. To reset an account, have an admin update its hash directly, or delete the row and re-run `pnpm db:seed` to recreate it with the temporary password.
