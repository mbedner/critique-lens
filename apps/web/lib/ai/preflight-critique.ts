import Anthropic from "@anthropic-ai/sdk";
import { claude, CLAUDE_MODEL } from "./claude";
import type { Reviewer, Pbi, PredictedConcern } from "@/types";

interface RelevantCritique {
  content: string;
  themes: string[];
  severity: string;
  id: string;
}

export interface PreflightResult {
  predictedConcerns: PredictedConcern[];
  likelyQuestions: string[];
  rationaleGaps: string[];
  readinessScore: number;
  confidenceScore: number;
  rawResponse: string;
}

export async function runPreflightCritique({
  imageBase64,
  imageMimeType,
  reviewer,
  pbi,
  annotationNotes,
  relevantCritiques,
}: {
  imageBase64: string;
  imageMimeType: "image/png" | "image/jpeg" | "image/webp";
  reviewer: Reviewer;
  pbi?: Pbi | null;
  annotationNotes?: string | null;
  relevantCritiques: RelevantCritique[];
}): Promise<PreflightResult> {
  const personaBlock = `
REVIEWER PERSONA: ${reviewer.name}
Role: ${[reviewer.seniority, reviewer.role, reviewer.team].filter(Boolean).join(", ")}
Critique tendencies: ${reviewer.critiqueTendencies.join(", ") || "unknown"}
Common feedback themes: ${reviewer.commonFeedbackThemes.join(", ") || "unknown"}
Preferred framing: ${reviewer.preferredFraming.join(", ") || "unknown"}
Summary: ${reviewer.personaSummary ?? "No persona summary available."}
`.trim();

  const pbiBlock = pbi
    ? `
PBI CONTEXT:
Title: ${pbi.title}
Problem: ${pbi.problemStatement ?? "Not specified"}
Why it matters: ${pbi.whyItMatters ?? "Not specified"}
Appetite: ${pbi.appetite ?? "Not specified"}
Constraints: ${pbi.constraints ?? "Not specified"}
Success metrics: ${pbi.successMetrics ?? "Not specified"}
`.trim()
    : "No PBI provided.";

  const historyBlock =
    relevantCritiques.length > 0
      ? relevantCritiques
          .map((c, i) => `[${i + 1}] Themes: ${c.themes.join(", ")}\n${c.content}`)
          .join("\n\n---\n\n")
      : "No relevant critique history found.";

  const notesBlock = annotationNotes
    ? `DESIGNER NOTES:\n${annotationNotes}`
    : "";

  const systemPrompt = `You are a design intelligence system running a preflight critique.
You analyze design frames through the lens of a specific reviewer's historical patterns.
Your job is to predict what that reviewer will likely say — based on their persona and critique history — before the review happens.

Be specific. Be evidence-based. Reference critique history patterns when predicting concerns.
Do not invent concerns that have no basis in the reviewer's history or the visible design.
Respond with valid JSON only.`;

  const userPrompt = `Analyze this design frame and predict how ${reviewer.name} will critique it.

${personaBlock}

${pbiBlock}

RELEVANT CRITIQUE HISTORY (${relevantCritiques.length} items):
${historyBlock}

${notesBlock}

Return JSON with this exact shape:
{
  "predictedConcerns": [
    {
      "concern": string,           // specific concern this reviewer is likely to raise
      "category": string,          // one of: hierarchy, density, discoverability, implementation, UX copy, data accuracy, consistency, scalability, visual polish, business clarity, other
      "severity": "low" | "medium" | "high",
      "confidence": number,        // 0.0-1.0 how confident based on historical patterns
      "supportingCritiqueIds": string[]  // IDs from history that support this prediction
    }
  ],
  "likelyQuestions": string[],     // 3-5 questions this reviewer will likely ask
  "rationaleGaps": string[],       // 2-4 things the designer should prepare to justify
  "readinessScore": number,        // 0-100: how ready is this design for this reviewer
  "confidenceScore": number        // 0.0-1.0: overall confidence in this analysis
}`;

  const imageContent: Anthropic.ImageBlockParam = {
    type: "image",
    source: {
      type: "base64",
      media_type: imageMimeType,
      data: imageBase64,
    },
  };

  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          imageContent,
          { type: "text", text: userPrompt },
        ],
      },
    ],
  });

  const rawResponse = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = rawResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(cleaned) as Omit<PreflightResult, "rawResponse">;

  return { ...parsed, rawResponse };
}
