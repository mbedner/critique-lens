import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { critiques } from "@/db/schema";
import { extractCritiqueThemes, generateEmbedding } from "@/lib/ai/extract-themes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (q) {
    // Semantic search via pgvector
    const embedding = await generateEmbedding(q);
    const vectorLiteral = `[${embedding.join(",")}]`;
    const results = await db.execute(
      sql`SELECT * FROM critiques ORDER BY embedding <=> ${vectorLiteral}::vector LIMIT 30`
    );
    return NextResponse.json(results.rows);
  }

  const data = await db.select().from(critiques).orderBy(critiques.createdAt);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const content = formData.get("content") as string;
  const reviewerId = formData.get("reviewerId") as string | null;
  const projectId = formData.get("projectId") as string | null;
  const pbiId = formData.get("pbiId") as string | null;
  const source = formData.get("source") as string | null;
  const severity = (formData.get("severity") as "low" | "medium" | "high") ?? "medium";
  const outcome = (formData.get("outcome") as "accepted" | "rejected" | "deferred" | "pending") ?? "pending";
  const tagsRaw = formData.get("tags") as string | null;
  const tags = tagsRaw ? JSON.parse(tagsRaw) : [];
  const critiqueDateRaw = formData.get("critiqueDate") as string | null;
  const imageFile = formData.get("image") as File | null;

  // Upload screenshot if provided
  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(`critiques/${Date.now()}-${imageFile.name}`, imageFile, {
      access: "public",
    });
    imageUrl = blob.url;
  }

  // AI theme extraction
  const extracted = await extractCritiqueThemes(content);

  // Generate embedding for semantic search
  const embeddingText = `${content} ${extracted.themes.join(" ")} ${extracted.tags.join(" ")}`;
  const embedding = await generateEmbedding(embeddingText);

  const [critique] = await db
    .insert(critiques)
    .values({
      content,
      reviewerId: reviewerId || null,
      projectId: projectId || null,
      pbiId: pbiId || null,
      source: source || null,
      severity: extracted.severity,
      outcome,
      tags: [...new Set([...tags, ...extracted.tags])],
      themes: extracted.themes,
      imageUrl,
      embedding,
      critiqueDate: critiqueDateRaw ? new Date(critiqueDateRaw) : null,
    })
    .returning();

  return NextResponse.json(critique, { status: 201 });
}
