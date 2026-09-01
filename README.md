# August Patisserie

Bilingual (English / 中文) storefront for August Patisserie, deployed to
**Cloudflare Workers** via the [OpenNext](https://opennext.js.org/cloudflare)
adapter. Customers browse the menu and check out through WhatsApp; an admin CMS
manages products, content, and reviews.

## Stack

- **Next.js 16** (App Router) + **next-intl** (en / zh)
- **next-auth v5** (Google) for customer reviews
- **Cloudflare D1** (`DB`) — products, categories, content, reviews
- **Cloudflare R2** (`BUCKET`) — uploaded images, served via `/api/images/[filename]`
- **@opennextjs/cloudflare** — build + deploy to Workers

## Local development

```bash
npm install
npm run dev            # http://localhost:3000
```

`npm run dev` uses the local miniflare D1/R2 state under `.wrangler/` (git-ignored).
Seed a local DB with `npm run db:migrate:local`.

Environment variables live in `.dev.vars` (git-ignored). Required:

```
ADMIN_PASSWORD=          # admin CMS password (no default — unset = login disabled)
NEXTAUTH_SECRET=         # also signs the admin session cookie
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_TRUST_HOST=true
# optional: ADMIN_SESSION_SECRET (falls back to NEXTAUTH_SECRET)
# optional: NEXT_PUBLIC_SITE_URL (canonical origin for sitemap/OG; defaults to the workers.dev URL)
```

## Quality gates

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
npm test               # vitest (session signing, WhatsApp encoding, product mapping)
```

CI (`.github/workflows/ci.yml`) runs all three on every push / PR.

## Database migrations

Migrations live in `migrations/`. Apply them explicitly (they are **not** run by deploy):

```bash
npm run db:migrate           # remote (production D1)
npm run db:migrate:local     # local dev D1
```

## Deploy

Secrets must be set on the Worker before the first deploy:

```bash
wrangler secret put ADMIN_PASSWORD
wrangler secret put NEXTAUTH_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put AUTH_TRUST_HOST
```

Then:

```bash
npm run db:migrate     # apply any new migrations to production D1
npm run deploy         # opennext build + deploy to Cloudflare Workers
```

`npm run deploy` runs `scripts/patch-node-modules.mjs` first (Windows/ESM build
patches for the current adapter versions). Set `PATCH_STRICT=1` in CI so a patch
that stops matching after a dependency bump fails the build instead of silently
no-op'ing.

## Configuration

- `wrangler.toml` — Worker config (D1, R2, assets, service binding, observability)
- `open-next.config.ts` — OpenNext (R2 incremental cache)
- `public/_headers` — static asset caching + baseline security headers
- security headers + CSP for dynamic routes are set in `src/middleware.ts`
