DO $$ BEGIN
 CREATE TYPE "public"."rulebook_type" AS ENUM('RULES', 'BOOK', 'MECHANICS', 'CASEPLAY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "ref_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_basketball_2023-24" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"page" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_volleyball_2023-24" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"page" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "ref_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_governing_body" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"abbreviation" varchar(50),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ref_sport" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"img_url" varchar(255),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"governing_body_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rulebook_simple_sentences" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(255),
	"text" text NOT NULL,
	"embedding" varchar(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rulebooks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"sport_id" varchar(255) NOT NULL,
	"governing_body_id" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rules" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"rulebook_id" varchar(255) NOT NULL,
	"rule_number" integer NOT NULL,
	"section_number" integer NOT NULL,
	"article_number" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ref_account" ADD CONSTRAINT "ref_account_user_id_ref_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ref_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ref_post" ADD CONSTRAINT "ref_post_created_by_ref_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."ref_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ref_session" ADD CONSTRAINT "ref_session_user_id_ref_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ref_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ref_sport" ADD CONSTRAINT "ref_sport_governing_body_id_ref_governing_body_id_fk" FOREIGN KEY ("governing_body_id") REFERENCES "public"."ref_governing_body"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rulebook_simple_sentences" ADD CONSTRAINT "rulebook_simple_sentences_rule_id_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."rules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rulebooks" ADD CONSTRAINT "rulebooks_sport_id_ref_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."ref_sport"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rulebooks" ADD CONSTRAINT "rulebooks_governing_body_id_ref_governing_body_id_fk" FOREIGN KEY ("governing_body_id") REFERENCES "public"."ref_governing_body"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rules" ADD CONSTRAINT "rules_rulebook_id_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."rulebooks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "ref_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ref_basketball_2023-24_embedding_index" ON "ref_basketball_2023-24" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ref_volleyball_2023-24_embedding_index" ON "ref_volleyball_2023-24" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "ref_post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "ref_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "ref_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rulebook_simple_sentences_embedding_index" ON "rulebook_simple_sentences" USING hnsw ("embedding" vector_cosine_ops);