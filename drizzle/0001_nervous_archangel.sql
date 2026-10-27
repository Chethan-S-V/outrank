ALTER TYPE "public"."product_event_type" ADD VALUE 'product_rejected' BEFORE 'contribution_created';--> statement-breakpoint
ALTER TYPE "public"."product_event_type" ADD VALUE 'product_approved' BEFORE 'contribution_created';--> statement-breakpoint
ALTER TYPE "public"."product_event_type" ADD VALUE 'product_moderation_rejected' BEFORE 'contribution_created';--> statement-breakpoint
CREATE UNIQUE INDEX "products_website_url_unique" ON "products" USING btree ("website_url");