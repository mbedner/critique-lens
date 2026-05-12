export type Severity = "low" | "medium" | "high";
export type Outcome = "accepted" | "rejected" | "deferred" | "pending";

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pbi {
  id: string;
  projectId: string;
  title: string;
  problemStatement?: string | null;
  whyItMatters?: string | null;
  appetite?: string | null;
  constraints?: string | null;
  dependencies?: string | null;
  successMetrics?: string | null;
  createdAt: Date;
}

export interface Reviewer {
  id: string;
  name: string;
  role?: string | null;
  team?: string | null;
  seniority?: string | null;
  critiqueTendencies: string[];
  commonFeedbackThemes: string[];
  commonQuestions: string[];
  preferredFraming: string[];
  personaSummary?: string | null;
  personaBuiltAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Critique {
  id: string;
  reviewerId?: string | null;
  projectId?: string | null;
  pbiId?: string | null;
  content: string;
  source?: string | null;
  severity: Severity;
  outcome: Outcome;
  tags: string[];
  themes: string[];
  imageUrl?: string | null;
  critiqueDate?: Date | null;
  createdAt: Date;
}

export interface PredictedConcern {
  concern: string;
  category: string;
  severity: Severity;
  confidence: number;
  supportingCritiqueIds?: string[];
}

export interface PreflightAnalysis {
  id: string;
  projectId?: string | null;
  pbiId?: string | null;
  reviewerId?: string | null;
  frameImageUrl?: string | null;
  frameName?: string | null;
  layerData?: unknown;
  annotationNotes?: string | null;
  predictedConcerns: PredictedConcern[];
  likelyQuestions: string[];
  rationaleGaps: string[];
  readinessScore?: number | null;
  confidenceScore?: number | null;
  createdAt: Date;
}
