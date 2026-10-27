CREATE TYPE "public"."financial_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."product_event_type" AS ENUM('product_created', 'product_verified', 'contribution_created', 'payment_succeeded', 'support_added', 'payment_refunded', 'payment_disputed', 'product_suspended');--> statement-breakpoint
CREATE TYPE "public"."product_moderation_status" AS ENUM('pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."product_verification_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"amount" numeric(20, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" "financial_status" DEFAULT 'pending' NOT NULL,
	"contributor_email" varchar(320),
	"payment_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contributions_amount_positive" CHECK ("contributions"."amount" > 0),
	CONSTRAINT "contributions_currency_iso_code" CHECK ("contributions"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contribution_id" uuid NOT NULL,
	"provider" varchar(64) NOT NULL,
	"provider_payment_id" varchar(255),
	"provider_checkout_id" varchar(255),
	"amount" numeric(20, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" "financial_status" DEFAULT 'pending' NOT NULL,
	"raw_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount" > 0),
	CONSTRAINT "payments_currency_iso_code" CHECK ("payments"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "product_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"contribution_id" uuid,
	"payment_id" uuid,
	"event_type" "product_event_type" NOT NULL,
	"amount" numeric(20, 2),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"website_url" text NOT NULL,
	"logo_url" text,
	"category_id" uuid NOT NULL,
	"owner_email" varchar(320) NOT NULL,
	"verification_status" "product_verification_status" DEFAULT 'pending' NOT NULL,
	"moderation_status" "product_moderation_status" DEFAULT 'pending' NOT NULL,
	"total_support_amount" numeric(20, 2) DEFAULT '0' NOT NULL,
	"support_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_support_currency_iso_code" CHECK ("products"."support_currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_contribution_id_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."contributions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_events" ADD CONSTRAINT "product_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_events" ADD CONSTRAINT "product_events_contribution_id_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."contributions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_events" ADD CONSTRAINT "product_events_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_unique" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_active_idx" ON "categories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contributions_product_id_idx" ON "contributions" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "contributions_status_idx" ON "contributions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contributions_created_at_idx" ON "contributions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "contributions_payment_id_unique" ON "contributions" USING btree ("payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_contribution_id_unique" ON "payments" USING btree ("contribution_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_provider_payment_id_unique" ON "payments" USING btree ("provider_payment_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_events_product_created_at_idx" ON "product_events" USING btree ("product_id","created_at");--> statement-breakpoint
CREATE INDEX "product_events_contribution_id_idx" ON "product_events" USING btree ("contribution_id");--> statement-breakpoint
CREATE INDEX "product_events_payment_id_idx" ON "product_events" USING btree ("payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_verification_status_idx" ON "products" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "products_moderation_status_idx" ON "products" USING btree ("moderation_status");--> statement-breakpoint
CREATE INDEX "products_leaderboard_total_support_idx" ON "products" USING btree ("total_support_amount" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");