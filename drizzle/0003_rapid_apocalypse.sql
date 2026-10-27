CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"handle" varchar(100) NOT NULL,
	"email" varchar(320) NOT NULL,
	"avatar_url" text,
	"bio" text,
	"provider" varchar(50) DEFAULT 'manual',
	"provider_id" varchar(255),
	"twitter_handle" varchar(100),
	"github_handle" varchar(100),
	"discord_handle" varchar(100),
	"linkedin_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "maker_name" varchar(160);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "twitter_handle" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "github_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discord_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "user_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "users_handle_unique" ON "users" USING btree ("handle");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;