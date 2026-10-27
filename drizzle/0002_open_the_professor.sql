CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(64) NOT NULL,
	"provider_event_id" varchar(255) NOT NULL,
	"event_type" varchar(128) NOT NULL,
	"status" varchar(32) DEFAULT 'processed' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "idempotency_key" varchar(255);--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_events_provider_event_id_unique" ON "webhook_events" USING btree ("provider","provider_event_id");--> statement-breakpoint
CREATE INDEX "webhook_events_created_at_idx" ON "webhook_events" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "contributions_idempotency_key_unique" ON "contributions" USING btree ("idempotency_key");