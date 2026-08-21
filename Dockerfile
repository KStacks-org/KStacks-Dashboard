# One image for the whole dashboard: the Express API also serves the built
# frontend, so a single container is the entire app.
#
# Same-origin is a requirement here, not a convenience — the CSRF cookie is
# read by the frontend and echoed back as a header, and auth-service's
# access_token cookie is SameSite=Lax. Split across two origins, neither
# would travel on an ordinary request.

# ---------- Stage 1: shared base ----------
FROM node:24-alpine AS base

# Prisma's query engine needs OpenSSL; alpine ships without it.
RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

# Manifests only, so a source-only change reuses the cached install layers
# below. The widget is a workspace member and its manifest must be present for
# --frozen-lockfile to resolve, but nothing of it is ever built or shipped.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY widget/package.json ./widget/

# ---------- Stage 2: build ----------
FROM base AS builder

RUN pnpm install --frozen-lockfile

COPY . .

# Vite bakes VITE_* into the client bundle at build time, so these are build
# args rather than runtime env. Both default to empty, which is what a
# same-origin deployment wants: the frontend calls /api on its own origin,
# and the login redirect falls back to the production auth-service URL.
ARG VITE_API_BASE_URL=""
ARG VITE_AUTH_SERVICE_LOGIN_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_AUTH_SERVICE_LOGIN_URL=$VITE_AUTH_SERVICE_LOGIN_URL

# Backend: prisma generate -> tsc -> tsc-alias. Frontend: paraglide -> tsc -> vite.
# Both generate code before compiling, so neither depends on artefacts that
# only exist on a developer's machine.
RUN pnpm build

# ---------- Stage 3: production dependencies ----------
# A separate clean install rather than pruning the builder's tree: `pnpm prune
# --prod` wants to confirm purging the modules directory and aborts with no TTY.
FROM base AS prod-deps

# --filter backend... keeps the frontend's runtime deps out: it ships as static
# files, so React and friends would be dead weight in this image.
RUN pnpm install --prod --frozen-lockfile --filter backend...

# The Prisma client is generated code, not something the lockfile installs, so
# it has to be regenerated against this stage's own node_modules. Possible
# because the prisma CLI is a production dependency — which it must be anyway
# for `prisma migrate deploy` to be runnable from the released image.
COPY backend/prisma ./backend/prisma
RUN pnpm --filter backend exec prisma generate

# ---------- Stage 4: runtime ----------
FROM node:24-alpine AS runner

RUN apk add --no-cache openssl wget

# Non-root, matching the uid/gid every other KStacks service image uses.
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Must stay /app: pnpm's store links are absolute paths created under /app in
# the earlier stages, so moving the tree would break dependency resolution.
WORKDIR /app

ENV NODE_ENV=production \
    PORT=4100 \
    STATIC_ROOT=/app/public

COPY --from=prod-deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=prod-deps --chown=appuser:appgroup /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/backend/package.json ./backend/package.json
COPY --from=builder --chown=appuser:appgroup /app/backend/dist ./backend/dist
# Schema and migrations ship with the image so `prisma migrate deploy` can be
# run against it as a separate step before a release rolls out.
COPY --from=builder --chown=appuser:appgroup /app/backend/prisma ./backend/prisma

# express.static over STATIC_ROOT resolves /assets/*, and anything it doesn't
# match falls through to index.html for client-side routing.
COPY --from=builder --chown=appuser:appgroup /app/frontend/dist ./public

USER appuser

EXPOSE 4100

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4100/health || exit 1

CMD ["node", "backend/dist/src/server.js"]
