import { claude, CLAUDE_MODEL } from "./claude";
import type { Reviewer } from "@/types";

interface CritiqueSnapshot {
  content: string;
  themes: string[];
  severity: string;
  outcome: string;
  source?: string | null;
}

export interface PersonaUpdate {
  critiqueTendencies: string[];
  commonFeedbackThemes: string[];
  commonQuestions: string[];
  preferredFraming: string[];
  personaSummary: string;
}

export async function buildReviewerPersona(
  reviewer: Reviewer,
  critiques: CritiqueSnapshot[]
): Promise<PersonaUpdate> {
  if (critiques.length === 0) {
    throw new Error("No critiques to build persona from.");
  }

  const critiqueBlock = critiques
    .map((c, i) =>
      `[${i + 1}] Severity: ${c.severity} | Outcome: ${c.outcome} | Themes: ${c.themes.join(", ")}\n${c.content}`
    )
    .join("\n\n---\n\n");

  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: `You are a design intelligence system that builds reviewer personas from critique history.
Analyze patterns in critique data and produce an accurate, evidence-based persona profile.
Be specific. Avoid generic personality descriptions. Focus on observable review patterns.
Respond with valid JSON only.`,
    messages: [
      {
        role: "user",
        content: `Build a reviewer persona for ${reviewer.name} (${[reviewer.seniority, reviewer.role, reviewer.team].filter(Boolean).join(", ")}) based on their critique history.

CRITIQUE HISTORY (${critiques.length} critiques):
${critiqueBlock}

Return JSON with this exact shape:
{
  "critiqueTendencies": string[],      // 3-6 observable review tendencies (e.g. "simplicity-focused", "implementation-sensitive")
  "commonFeedbackThemes": string[],    // 4-8 recurring feedback categories from this history
  "commonQuestions": string[],         // 3-5 characteristic questions this reviewer asks, as quoted strings
  "preferredFraming": string[],        // 2-4 framing styles that resonate with this reviewer
  "personaSummary": string             // 3-4 sentence evidence-based description of this reviewer's perspective and priorities
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as PersonaUpdate;
}
