import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  real,
  jsonb,
  pgEnum,
  vector,
} from "drizzle-orm/pg-core";

// --- Enums ---

export const severityEnum = pgEnum("severity", ["low", "medium", "high"]);
export const outcomeEnum = pgEnum("outcome", ["accepted", "rejected", "deferred", "pending"]);

// --- Projects ---

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- PBIs (Problem/Brief items) ---

export const pbis = pgTable("pbis", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  problemStatement: text("problem_statement"),
  whyItMatters: text("why_it_matters"),
  appetite: text("appetite"),
  constraints: text("constraints"),
  dependencies: text("dependencies"),
  successMetrics: text("success_metrics"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Reviewers ---

export const reviewers = pgTable("reviewers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  team: text("team"),
  seniority: text("seniority"),
  // AI-generated + user-editable persona data
  critiqueTendencies: jsonb("critique_tendencies").$type<string[]>().default([]),
  commonFeedbackThemes: jsonb("common_feedback_themes").$type<string[]>().default([]),
  commonQuestions: jsonb("common_questions").$type<string[]>().default([]),
  preferredFraming: jsonb("preferred_framing").$type<string[]>().default([]),
  personaSummary: text("persona_summary"),
  // Track when persona was last re-derived from critiques
  personaBuiltAt: timestamp("persona_built_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Critiques ---

export const critiques = pgTable("critiques", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewerId: uuid("reviewer_id").references(() => reviewers.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  pbiId: uuid("pbi_id").references(() => pbis.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  source: text("source"), // "notes", "slack", "teams", "meeting", "screenshot"
  severity: severityEnum("severity").default("medium"),
  outcome: outcomeEnum("outcome").default("pending"),
  tags: jsonb("tags").$type<string[]>().default([]),
  themes: jsonb("themes").$type<string[]>().default([]),
  imageUrl: text("image_url"),
  // pgvector embedding for semantic search
  embedding: vector("embedding", { dimensions: 1536 }),
  critiqueDate: timestamp("critique_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Preflight Analyses ---

export const preflightAnalyses = pgTable("preflight_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  pbiId: uuid("pbi_id").references(() => pbis.id, { onDelete: "set null" }),
  reviewerId: uuid("reviewer_id").references(() => reviewers.id, { onDelete: "set null" }),
  frameImageUrl: text("frame_image_url"),
  frameName: text("frame_name"),
  layerData: jsonb("layer_data"),
  annotationNotes: text("annotation_notes"),
  // AI outputs
  predictedConcerns: jsonb("predicted_concerns").$type<PredictedConcern[]>().default([]),
  likelyQuestions: jsonb("likely_questions").$type<string[]>().default([]),
  rationale_gaps: jsonb("rationale_gaps").$type<string[]>().default([]),
  readinessScore: integer("readiness_score"), // 0–100
  confidenceScore: real("confidence_score"),  // 0.0–1.0
  rawResponse: text("raw_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Types used in jsonb columns ---

export type PredictedConcern = {
  concern: string;
  category: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  supportingCritiqueIds?: string[];
};
