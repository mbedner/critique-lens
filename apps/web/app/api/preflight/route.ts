import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { preflightAnalyses, reviewers, pbis, critiques } from "@/db/schema";
import { runPreflightCritique } from "@/lib/ai/preflight-critique";
import { generateEmbedding } from "@/lib/ai/extract-themes";
import type { Reviewer, Pbi } from "@/types";

export async function GET() {
  const data = await db
    .select()
    .from(preflightAnalyses)
    .orderBy(preflightAnalyses.createdAt);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const reviewerId = formData.get("reviewerId") as string;
  const projectId = formData.get("projectId") as string | null;
  const pbiId = formData.get("pbiId") as string | null;
  const annotationNotes = formData.get("annotationNotes") as string | null;
  const imageFile = formData.get("image") as File;

  if (!reviewerId || !imageFile) {
    return NextResponse.json({ error: "reviewerId and image are required" }, { status: 400 });
  }

  // Load reviewer
  const [reviewer] = await db.select().from(reviewers).where(eq(reviewers.id, reviewerId));
  if (!reviewer) return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });

  // Load PBI if provided
  let pbi = null;
  if (pbiId) {
    const [found] = await db.select().from(pbis).where(eq(pbis.id, pbiId));
    pbi = found ?? null;
  }

  // Upload frame to blob storage
  const blob = await put(`preflight/${Date.now()}-${imageFile.name}`, imageFile, {
    access: "public",
  });

  // Build query embedding from reviewer persona + PBI to find relevant critiques
  const queryText = [
    reviewer.personaSummary ?? reviewer.name,
    reviewer.commonFeedbackThemes?.join(" "),
    pbi ? `${pbi.title} ${pbi.problemStatement ?? ""}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const queryEmbedding = await generateEmbedding(queryText);
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const relevantCritiquesResult = await db.execute(
    sql`SELECT id, content, themes, severity FROM critiques
        WHERE reviewer_id = ${reviewerId}
        ORDER BY embedding <=> ${vectorLiteral}::vector
        LIMIT 10`
  );
  const relevantCritiques = relevantCritiquesResult.rows as {
    id: string;
    content: string;
    themes: string[];
    severity: string;
  }[];

  // Convert image to base64
  const arrayBuffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = (imageFile.type as "image/png" | "image/jpeg" | "image/webp") || "image/png";

  // Run AI analysis
  const result = await runPreflightCritique({
    imageBase64: base64,
    imageMimeType: mimeType,
    reviewer: reviewer as unknown as Reviewer,
    pbi: pbi as unknown as Pbi | null,
    annotationNotes,
    relevantCritiques,
  });

  // Persist
  const [analysis] = await db
    .insert(preflightAnalyses)
    .values({
      reviewerId,
      projectId: projectId || null,
      pbiId: pbiId || null,
      frameImageUrl: blob.url,
      frameName: imageFile.name.replace(/\.[^.]+$/, ""),
      annotationNotes,
      predictedConcerns: result.predictedConcerns,
      likelyQuestions: result.likelyQuestions,
      rationale_gaps: result.rationaleGaps,
      readinessScore: result.readinessScore,
      confidenceScore: result.confidenceScore,
      rawResponse: result.rawResponse,
    })
    .returning();

  return NextResponse.json(analysis, { status: 201 });
}
