CREATE TYPE "public"."outcome" AS ENUM('accepted', 'rejected', 'deferred', 'pending');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TABLE "critiques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reviewer_id" uuid,
	"project_id" uuid,
	"pbi_id" uuid,
	"content" text NOT NULL,
	"source" text,
	"severity" "severity" DEFAULT 'medium',
	"outcome" "outcome" DEFAULT 'pending',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"themes" jsonb DEFAULT '[]'::jsonb,
	"image_url" text,
	"embedding" vector(1536),
	"critique_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pbis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"problem_statement" text,
	"why_it_matters" text,
	"appetite" text,
	"constraints" text,
	"dependencies" text,
	"success_metrics" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preflight_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"pbi_id" uuid,
	"reviewer_id" uuid,
	"frame_image_url" text,
	"frame_name" text,
	"layer_data" jsonb,
	"annotation_notes" text,
	"predicted_concerns" jsonb DEFAULT '[]'::jsonb,
	"likely_questions" jsonb DEFAULT '[]'::jsonb,
	"rationale_gaps" jsonb DEFAULT '[]'::jsonb,
	"readiness_score" integer,
	"confidence_score" real,
	"raw_response" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviewers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"team" text,
	"seniority" text,
	"critique_tendencies" jsonb DEFAULT '[]'::jsonb,
	"common_feedback_themes" jsonb DEFAULT '[]'::jsonb,
	"common_questions" jsonb DEFAULT '[]'::jsonb,
	"preferred_framing" jsonb DEFAULT '[]'::jsonb,
	"persona_summary" text,
	"persona_built_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "critiques" ADD CONSTRAINT "critiques_reviewer_id_reviewers_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "critiques" ADD CONSTRAINT "critiques_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "critiques" ADD CONSTRAINT "critiques_pbi_id_pbis_id_fk" FOREIGN KEY ("pbi_id") REFERENCES "public"."pbis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pbis" ADD CONSTRAINT "pbis_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preflight_analyses" ADD CONSTRAINT "preflight_analyses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preflight_analyses" ADD CONSTRAINT "preflight_analyses_pbi_id_pbis_id_fk" FOREIGN KEY ("pbi_id") REFERENCES "public"."pbis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preflight_analyses" ADD CONSTRAINT "preflight_analyses_reviewer_id_reviewers_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewers"("id") ON DELETE set null ON UPDATE no action;