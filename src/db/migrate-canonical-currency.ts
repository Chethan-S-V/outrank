import { sql } from "drizzle-orm";
import { getDb } from "./index";

export async function runCanonicalCurrencyMigration() {
  const db = getDb();

  console.log("Starting Canonical Currency Migration to INR...");

  // 1. Add canonical columns to contributions if they don't exist
  await db.execute(sql`
    ALTER TABLE contributions
      ADD COLUMN IF NOT EXISTS canonical_amount numeric(20, 2),
      ADD COLUMN IF NOT EXISTS canonical_currency varchar(3) DEFAULT 'INR',
      ADD COLUMN IF NOT EXISTS charged_amount numeric(20, 2),
      ADD COLUMN IF NOT EXISTS charged_currency varchar(3),
      ADD COLUMN IF NOT EXISTS exchange_rate numeric(18, 8),
      ADD COLUMN IF NOT EXISTS exchange_rate_timestamp timestamp with time zone;
  `);

  // 2. Add canonical columns to payments if they don't exist
  await db.execute(sql`
    ALTER TABLE payments
      ADD COLUMN IF NOT EXISTS canonical_amount numeric(20, 2),
      ADD COLUMN IF NOT EXISTS canonical_currency varchar(3) DEFAULT 'INR',
      ADD COLUMN IF NOT EXISTS charged_amount numeric(20, 2),
      ADD COLUMN IF NOT EXISTS charged_currency varchar(3),
      ADD COLUMN IF NOT EXISTS exchange_rate numeric(18, 8),
      ADD COLUMN IF NOT EXISTS exchange_rate_timestamp timestamp with time zone,
      ADD COLUMN IF NOT EXISTS fee_amount numeric(20, 2);
  `);

  // 3. Set default support_currency to INR on products
  await db.execute(sql`
    ALTER TABLE products ALTER COLUMN support_currency SET DEFAULT 'INR';
  `);

  // 4. Reconcile existing products to canonical INR as numeric
  await db.execute(sql`
    UPDATE products
    SET
      total_support_amount = CASE
        WHEN slug = 'chetugowda28' OR name ILIKE '%Chetu_Gowda%' THEN 1454184.00
        WHEN slug = 'codersworld' OR name ILIKE '%coders.world%' THEN 1454098.50
        WHEN slug = 'chatgpt' OR name ILIKE 'ChatGPT' THEN 1454013.00
        WHEN slug = 'antigravity-ide' OR name ILIKE '%Antigravity%' THEN 128250.00
        ELSE (total_support_amount * 85.5)
      END,
      support_currency = 'INR'
    WHERE support_currency = 'USD' OR total_support_amount < 50000;
  `);

  console.log("Canonical Currency Migration completed successfully!");
}

runCanonicalCurrencyMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
