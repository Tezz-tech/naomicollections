# Naomi's Collections

Premium fashion e-commerce platform — menswear, dresses, shoes and accessories.

> "Curated for the way you want to be seen."

A full-stack store: a luxury-minimal storefront, a role-based admin dashboard, Paystack
checkout, and a branded transactional email system — built as a monorepo.

---

## 1. Tech Stack

| Layer | Stack |
|---|---|
| Storefront + Admin | React 18, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, React Hook Form + Zod, Framer Motion, Recharts |
| Backend | Node.js, Express, MongoDB + Mongoose |
| Payments | Paystack (server-initiated redirect checkout + webhook) |
| Images | Cloudinary |
| Email | Resend (default) or SMTP via Nodemailer |
| Auth | JWT access + refresh tokens in httpOnly cookies, bcrypt, role/permission-based access |

## 2. Project Structure

```
/client   React storefront — the admin dashboard lives inside it at /admin,
          protected by role, and is code-split from the public bundle.
/server   Express REST API — models, controllers, routes, services, middleware.
```

---

## 3. Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB database — local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Install & configure

```bash
# from the repo root
npm install

cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in `server/.env` — at minimum `MONGO_URI` and a pair of long random strings for
`JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`. Everything else (Paystack, Cloudinary, Resend)
has safe placeholder defaults — those features log a clear "not configured" message and
skip gracefully until you add real keys.

### Seed & run

```bash
npm run seed          # categories, 10 sample products, all 37 Nigerian delivery zones,
                       # hero banners, and a super-admin account (from server/.env)

npm run dev:server    # http://localhost:5000
npm run dev:client    # http://localhost:5173
```

Health check: `GET http://localhost:5000/api/health`

**Storefront:** [http://localhost:5173](http://localhost:5173)
**Admin dashboard:** log in at `/login` with the seeded `SUPER_ADMIN_EMAIL` /
`SUPER_ADMIN_PASSWORD` (defaults: `admin@naomiscollections.com` / `ChangeMe123!`) — an
admin/super-admin login redirects straight to `/admin` automatically.

---

## 4. Environment Variables

### `server/.env`

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | | `development` or `production` |
| `PORT` | | Only relevant for a persistent server (local dev, Render) — your host sets this automatically. Unused on Vercel, which never calls `local.js` |
| `API_URL` | | This API's own public URL |
| `CLIENT_URL` | ✅ | Storefront origin — used for CORS whitelist, cookie settings, and email links |
| `ADMIN_URL` | | Admin origin (same domain as `CLIENT_URL` + `/admin` in this setup) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | ✅ | Long random strings — never reuse across environments |
| `JWT_ACCESS_EXPIRES` / `JWT_REFRESH_EXPIRES` | | Default `15m` / `30d` |
| `COOKIE_DOMAIN` | | |
| `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` | for payments | From your Paystack dashboard. Webhook signatures use the secret key directly — Paystack has no separate webhook-signing secret |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | for image upload | From your Cloudinary dashboard |
| `EMAIL_PROVIDER` | | `resend` (default) or `smtp` |
| `RESEND_API_KEY` | for email | From [resend.com/api-keys](https://resend.com/api-keys) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | if `EMAIL_PROVIDER=smtp` | |
| `EMAIL_FROM` | for email | Must be on a domain verified in Resend, e.g. `"Naomi's Collections <no-reply@yourdomain.com>"` |
| `SUPER_ADMIN_NAME` / `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | ✅ | Used only by `npm run seed` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | | Auth & payment route rate limiting |

### `client/.env`

| Variable | Notes |
|---|---|
| `VITE_API_URL` | `/api` in local dev (Vite proxies to the backend). **In production, the full absolute URL of the deployed API**, e.g. `https://naomis-collections-api.onrender.com/api` — the frontend and backend are separate origins once deployed |
| `VITE_WHATSAPP_NUMBER` | International format, no `+` or spaces, e.g. `2348012345678`. Leave blank to hide the WhatsApp button |

---

## 5. Deployment

Both platforms below work with this repo unchanged. MongoDB Atlas, Cloudinary, Paystack,
and Resend stay external either way. Pick one.

### Option A — Vercel (both apps)

Vercel deploys serverless — there's no persistent process, so this is architecturally
different from Render and the codebase is already set up for it:

- **`server/src/app.js`** exports the Express app directly (`export default app`) and is
  the *only* file matching Vercel's Express auto-detection pattern in `server/src/` — the
  traditional `app.listen()` boot script lives at **`server/src/local.js`** instead, deliberately
  named so Vercel doesn't mistake it for the entry point.
- **`server/src/config/db.js`** caches the Mongoose connection on `global` across
  invocations, so a warm serverless instance reuses one connection instead of opening a new
  one per request (this matters a lot — a fresh connection per request will exhaust
  Atlas's connection limit within minutes).
- A DB-connect gate runs as the first real middleware in `app.js`, before every route
  *including* the Paystack webhook, so a cold start always has a ready connection before
  any handler touches Mongoose.
- **`client/vercel.json`** adds the SPA rewrite Vite's docs recommend, so deep links like
  `/admin/products` or `/order/NC-...` don't 404 on refresh.
- **No `server/vercel.json` is needed** — Vercel's default function duration (300s) covers
  everything here (Cloudinary uploads, newsletter sends), and Express auto-detection
  handles routing with zero config.

**Set up two separate Vercel projects** (same repo, different root directories):

1. **Backend** — New Project → import this repo → set **Root Directory** to `server`.
   Vercel auto-detects Express; no build/output settings needed. Add all the `server/.env`
   variables from the table above under Project Settings → Environment Variables.
2. **Frontend** — New Project → import this repo again → set **Root Directory** to
   `client`. Vercel auto-detects Vite. Add `VITE_API_URL` = the backend project's URL +
   `/api` (e.g. `https://naomis-collections-api.vercel.app/api`), and `VITE_WHATSAPP_NUMBER`.

Then, same as Render below: cross-link `CLIENT_URL`/`ADMIN_URL` on the backend to the
frontend's URL, add the Paystack webhook, seed the production database, and set up the
abandoned-cart cron (Vercel's dashboard has a **Cron Jobs** feature — point one at a route
that calls the reminder logic, or trigger it manually from Admin → Emails → Automation).

**Serverless-specific things to know:**
- Cold starts add latency to the first request after idle — subsequent requests on a warm
  instance are fast.
- `express-rate-limit`'s in-memory store is per-instance, not global, under serverless —
  multiple concurrent instances each track their own counts, so it's a weaker (not zero)
  layer of protection against brute-forcing auth routes than on a single persistent server.
- Since frontend and backend are separate Vercel projects (different subdomains), cookies
  need `SameSite=None; Secure` — already handled in `server/src/utils/jwt.js` whenever
  `NODE_ENV=production`.

### Option B — Render (both apps)

Render runs a normal persistent Node process, closer to traditional hosting.

**Blueprint (recommended):** a [`render.yaml`](render.yaml) at the repo root defines both
services. In the Render dashboard: **New → Blueprint**, point it at this repo, and it
provisions `naomis-collections-api` (Node web service, `/server`) and
`naomis-collections` (static site, `/client`, with the same SPA rewrite rule via
[`client/public/_redirects`](client/public/_redirects)). Every secret is marked
`sync: false` in the blueprint, so Render prompts for them during setup.

**Manual setup:**

Backend (New → Web Service): root directory `server`, build command `npm install`, start
command `npm start`, health check path `/api/health`, plus all the `server/.env`
variables.

Frontend (New → Static Site): root directory `client`, build command
`npm install && npm run build`, publish directory `dist`, plus `VITE_API_URL` = the
backend's URL + `/api`. Render reads `client/public/_redirects` automatically for SPA
routing.

### After either is live

1. **Cross-link the URLs**: set the backend's `CLIENT_URL`/`ADMIN_URL` to the deployed
   frontend URL, and the frontend's `VITE_API_URL` to the deployed backend URL + `/api`.
   Redeploy the frontend after changing a `VITE_*` variable — it's baked in at build time.
2. **Paystack webhook**: in the Paystack dashboard, add a webhook pointing to
   `https://<your-api-domain>/api/webhooks/paystack`.
3. **Seed the production database** once, from your machine, pointed at the production
   `MONGO_URI`: `MONGO_URI=<prod-uri> npm run seed --workspace=server`.
4. **Schedule abandoned-checkout reminders** (Render Cron Jobs or Vercel Cron Jobs) to run
   `npm run send:abandoned-cart-reminders --workspace=server` hourly. Until that's set up,
   an admin can trigger it manually from Admin → Emails → Automation.
5. Smoke-test: register an account, browse products, add to cart, check out with a
   Paystack test card, confirm the order lands in Admin → Orders and a confirmation email
   arrives.

---

## 6. Default Login

After seeding, log in at `/login` with the credentials from `SUPER_ADMIN_EMAIL` /
`SUPER_ADMIN_PASSWORD` in `server/.env` (defaults: `admin@naomiscollections.com` /
`ChangeMe123!`). **Change this password in production.**

---

## 7. What's Built

**Storefront** — homepage (hero carousel, category tiles, new arrivals, flash sale
countdown, bulk deals, testimonials, newsletter), shop with filters/sort/pagination,
product pages (variant selection, bulk pricing tables, reviews, related + recently viewed,
notify-me-when-back-in-stock), cart, guest or account checkout with live delivery-fee/coupon
quoting, Paystack payment, order tracking with a visual status timeline, full account area
(profile, addresses, wishlist, order history, bulk quote requests), bulk-order quote
request flow, legal pages, contact form, WhatsApp button, SEO/Open Graph tags.

**Admin dashboard** (`/admin`, role-gated) — revenue/sales overview with charts, products
(variants, single/bulk/both pricing tiers, image upload), categories, orders (status
updates that email the customer, delivery-date editing, tracking notes, printable invoice),
bulk quote requests (respond with a quote, convert to a real order), customers
(block/unblock), delivery zones + free-delivery threshold, coupons, content (banners,
announcement bar), emails (log, compose, newsletter, abandoned-cart automation), payments,
reviews (approve/hide), admins & permission-based roles, store settings.

**Backend** — server-authoritative pricing and stock on every order (never trusts client
totals), idempotent Paystack webhook with HMAC verification, JWT auth with httpOnly
cookies, role/permission middleware, rate limiting, input validation, Cloudinary uploads,
every transactional/marketing email logged to the database.

## 8. Known Limitations

- Converting a bulk quote into an order has an API (`POST /api/bulk-requests/admin/:id/convert`)
  but no admin UI product-picker yet.
- Abandoned-checkout reminders need a real scheduler in production (see step 4 above).
- The storefront JS bundle is ~660KB; admin is already code-split from it, but further
  route-level splitting of the storefront itself is a good next performance pass.
- MongoDB text search (used for the search bar) has stemming but not true typo-tolerance.

## 9. Useful Scripts

Run from the repo root unless noted.

```bash
npm run dev:server                                    # backend, with nodemon
npm run dev:client                                    # frontend
npm run seed                                           # (re)seed the database
npm run build:client                                   # production build of the client
npm run send:abandoned-cart-reminders --workspace=server  # manual trigger; schedule this in production
```
