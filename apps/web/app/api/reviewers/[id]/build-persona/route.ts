import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reviewers, critiques } from "@/db/schema";
import { buildReviewerPersona } from "@/lib/ai/build-persona";
import type { Reviewer } from "@/types";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [reviewer] = await db.select().from(reviewers).where(eq(reviewers.id, id));
  if (!reviewer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reviewerCritiques = await db
    .select()
    .from(critiques)
    .where(eq(critiques.reviewerId, id));

  if (reviewerCritiques.length === 0) {
    return NextResponse.json(
      { error: "No critiques found for this reviewer. Add critiques first." },
      { status: 400 }
    );
  }

  const critiqueSnapshots = reviewerCritiques.map((c) => ({
    content: c.content,
    themes: c.themes ?? [],
    severity: c.severity ?? "medium",
    outcome: c.outcome ?? "pending",
    source: c.source,
  }));
  const persona = await buildReviewerPersona(reviewer as unknown as Reviewer, critiqueSnapshots);

  const [updated] = await db
    .update(reviewers)
    .set({
      ...persona,
      personaBuiltAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(reviewers.id, id))
    .returning();

  return NextResponse.json(updated);
}
