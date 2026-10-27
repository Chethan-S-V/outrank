# Outrank — Global Product Discovery & Paid Visibility Platform

> **Outrank** is a complete, production-ready product discovery and verified paid visibility platform built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, and Stripe Checkout.

---

## Key Highlights

- **Original Brand & UI**: Faithful desktop 3-column layout matching the target interface:
  - **Left**: Category navigation with count badges, "Explore" filters, and 3D rising illustration card.
  - **Center**: "Claim #1 for $17,006" dark violet gradient hero banner, URL/@handle input, and real-time ranked product cards with #1 Gold, #2 Silver, #3 Bronze accents, verified badges, like counts, and `View →` buttons.
  - **Right**: Today's Ranking flame widget, Weekly Movement/Trending widget, and 2x2 Platform Stats cards for Products, Categories, Supporters, and Visitors.
- **Real Database Integration**: PostgreSQL schema managing `categories`, `products`, `contributions`, `payments`, `product_events`, and `webhook_events`.
- **Integrity First**:
  - Deterministic ranking: `total_support_amount DESC, created_at ASC`.
  - Only confirmed, successful payments affect rankings (never pending or simulated).
  - No fake metrics, simulated success messages, or hardcoded fake production statistics.
- **Enterprise Security**:
  - SSRF protection against RFC 1918 private IPs, localhost, and AWS metadata endpoints.
  - HMAC-SHA256 signature verification for Stripe Webhooks and Admin session authentication.
  - Webhook deduplication and idempotency ledger preventing double-crediting.
  - Full audit trail logging for all product and payment lifecycle events.
- **Production QA**:
  - 100% passing automated test suite (28 unit and integration tests across 5 test suites).
  - Clean ESLint with 0 warnings/errors.
  - Type-safe build compiling 23 static and dynamic routes with Turbopack.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS, Lucide React, Framer Motion |
| **Backend** | Next.js Server Components, Route Handlers, Node.js 22 |
| **Database** | PostgreSQL 16, Drizzle ORM, Drizzle Kit |
| **Validation** | Zod v4, URL normalization, SSRF defenses |
| **Payments** | Stripe Checkout API, HMAC-SHA256 Webhook Verification |
| **Testing** | Vitest, Node Crypto, PostgreSQL integration testing |

---

## Getting Started

### 1. Prerequisites
- Node.js `20+` or `22+`
- PostgreSQL `14+` running locally or accessible remotely
- Stripe account (for live payments)

### 2. Environment Setup
Copy the template and configure your local credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/outrank"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_SECRET="your-secure-32-byte-hex-string"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Database Migration & Seeding
```bash
# Apply migrations
npx drizzle-kit migrate

# Seed canonical categories and showcase products
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on port 3000 |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Starts Next.js production server |
| `npm run lint` | Runs ESLint checks across entire codebase |
| `npm test` | Runs the full Vitest test suite |
| `npm run db:seed` | Seeds canonical categories and showcase data |
| `npx drizzle-kit migrate` | Applies all pending database migrations |
| `npx drizzle-kit check` | Verifies schema consistency with migrations |

---

## Core Application Routes

### Public Pages
- `/` — Homepage with Claim Hero, categories, and real-time rankings.
- `/daily` — Daily ranking leaderboard snapshot.
- `/categories` & `/categories/[slug]` — Category directory and filtered rankings.
- `/products/[slug]` — Detailed product showcase with promotional disclosures.
- `/products/[slug]/contribute` — Contribution amount selector and checkout trigger.
- `/about` & `/guidelines` — Promotional support disclosures, rules, and ethics.
- `/submit` — Product submission with URL validation and category assignment.
- `/payment/success` & `/payment/cancelled` — Post-checkout callback handlers.

### Admin Portal
- `/admin/login` — Secure passwordless login with HMAC authentication.
- `/admin` — Product moderation, approval, and verification dashboard.

### API Endpoints
- `GET /api/public/rankings` — Fetch ranked, eligible products.
- `GET /api/public/search` — Debounced search for Ctrl+K search modal.
- `POST /api/products` — Product submission endpoint.
- `POST /api/contributions` — Initiate Stripe Checkout session.
- `POST /api/payments/webhook` — Stripe signed webhook listener.
- `GET /api/health/db` — PostgreSQL connection status probe.

---

## Deployment & Production Operations

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full production deployment instructions covering Vercel, Docker, database snapshots, and webhook security.
