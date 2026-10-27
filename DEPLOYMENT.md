# Outrank — Production Deployment & Operations Guide

This guide details the procedure for provisioning, configuring, testing, and deploying the **Outrank** platform to production environments.

---

## 1. System Architecture & Prerequisites

Outrank is a Next.js 16 App Router application backed by PostgreSQL and Stripe Checkout.

### Requirements
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Database**: PostgreSQL `14+` or `16+` (e.g. AWS RDS, Supabase, Neon, or self-hosted PostgreSQL)
- **Payment Gateway**: Stripe account (Test mode for staging, Live mode for production)
- **SSL/TLS**: HTTPS is mandatory for Stripe webhooks and secure session cookies

---

## 2. Environment Variables Configuration

In production, configure the following environment variables through your hosting provider dashboard or secret manager. **Never commit actual secrets to version control.**

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string with SSL enabled | `postgresql://usr:pwd@db.host.com:5432/outrank?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Fully qualified public URL of the application | `https://outrank.yourdomain.com` |
| `ADMIN_SECRET` | **Yes** | High-entropy string (≥32 chars) for HMAC-SHA256 session tokens | Generated via `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe API Secret Key (`sk_live_...` or `sk_test_...`) | `sk_live_51...` |
| `STRIPE_WEBHOOK_SECRET`| **Yes** | Stripe Webhook signing secret (`whsec_...`) | `whsec_...` |
| `NODE_ENV` | Optional | Set automatically by deployment platform | `production` |

---

## 3. Database Provisioning & Migrations

### 3.1 Initial Migration
Outrank uses Drizzle ORM for schema definitions and migrations.

Run all pending SQL migrations against your target database:
```bash
npx drizzle-kit migrate
```

Verify migration status:
```bash
npx drizzle-kit check
```

### 3.2 Canonical Category Seeding
To populate the 8 canonical categories (AI & Agents, Developer Tools, Productivity, SEO, Marketing, Design, Crypto & Web3, Other) and initial showcase entries:
```bash
npm run db:seed
```

### 3.3 Database Health Check
Once connected, the database status can be monitored via the built-in health endpoint:
```http
GET /api/health/db
```
Returns `{"status": "healthy", "timestamp": "...", "database": "connected"}` with HTTP 200.

---

## 4. Hosting & Deployment Options

### Option A: Vercel Deployment (Recommended for Serverless)

1. **Connect Repository**: Import the Git repository in the Vercel dashboard.
2. **Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Environment Variables**: Add all variables from Section 2 in the Vercel Project Settings > Environment Variables.
4. **Deploy**: Trigger a production deployment.

### Option B: Self-Hosted Docker Container

Outrank supports building a standalone production container.

#### `Dockerfile`:
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 5. Stripe Webhook Setup

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks).
2. Navigate to **Developers > Webhooks > Add endpoint**.
3. **Endpoint URL**: `https://outrank.yourdomain.com/api/payments/webhook`
4. **Listen to events**:
   - Select `checkout.session.completed`
5. Click **Add endpoint**.
6. Copy the **Signing secret** (`whsec_...`) and save it as `STRIPE_WEBHOOK_SECRET` in your hosting provider's environment settings.

### Testing Webhooks Locally:
Use the Stripe CLI to forward events to your local server:
```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

---

## 6. Security Hardening & Operational Policies

1. **Strict Content Security & Anti-Fraud**:
   - Contribution idempotency ledger prevents duplicate balance increments across duplicate webhook events.
   - Tied rankings are resolved deterministically by `total_support_amount DESC, created_at ASC`.
   - All external URLs are validated against SSRF attacks (blocking `localhost`, private RFC 1918 IPs, IPv6 link-local, and AWS metadata IP `169.254.169.254`).
2. **Admin Authentication**:
   - The admin portal (`/admin`) is gated with HMAC-SHA256 session signatures in `outrank_admin_session` cookies.
   - Session tokens have `HttpOnly`, `SameSite=Lax`, and `Secure` flags enforced in production.
3. **Backup Strategy**:
   - Configure automated daily PostgreSQL snapshots with a 30-day retention window.
   - For point-in-time recovery (PITR), ensure continuous Write-Ahead Log (WAL) archiving is activated on the database cluster.

---

## 7. QA Verification Checklist

Before directing real traffic to production:

- [ ] `npm test` runs with 100% pass rate (28 unit and integration tests).
- [ ] `npm run lint` reports 0 errors and 0 warnings.
- [ ] `npx tsc --noEmit` exits with code 0.
- [ ] `npm run build` completes cleanly with Turbopack.
- [ ] Database migrations applied and verified via `npx drizzle-kit check`.
- [ ] Admin login verified at `/admin/login`.
- [ ] Product submission flow tested at `/submit`.
- [ ] Stripe test transaction completed and confirmed via webhook ledger.
- [ ] Verification badges and public ranks reflect confirmed database records only.
