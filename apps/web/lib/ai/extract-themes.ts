import { openai, EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "./openai";
import { claude, CLAUDE_MODEL } from "./claude";

export interface ExtractedCritiqueData {
  themes: string[];
  tags: string[];
  severity: "low" | "medium" | "high";
  summary: string;
}

export async function extractCritiqueThemes(
  content: string
): Promise<ExtractedCritiqueData> {
  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: `You are a design critique analyst. Extract structured data from design critique text.
Respond with valid JSON only. No markdown, no explanation.`,
    messages: [
      {
        role: "user",
        content: `Analyze this design critique and extract structured data.

CRITIQUE TEXT:
${content}

Return JSON with this exact shape:
{
  "themes": string[],        // 2-6 recurring topics (e.g. "hierarchy", "density", "discoverability", "implementation")
  "tags": string[],          // 3-8 specific searchable keywords
  "severity": "low" | "medium" | "high",  // overall severity of concern
  "summary": string          // 1-2 sentence plain-English summary of the core critique
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as ExtractedCritiqueData;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return response.data[0].embedding;
}
