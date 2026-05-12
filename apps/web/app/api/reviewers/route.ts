import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviewers } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(reviewers).orderBy(reviewers.createdAt);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [reviewer] = await db.insert(reviewers).values({
    name: body.name,
    role: body.role || null,
    team: body.team || null,
    seniority: body.seniority || null,
    critiqueTendencies: body.critiqueTendencies ?? [],
    commonFeedbackThemes: body.commonFeedbackThemes ?? [],
    commonQuestions: body.commonQuestions ?? [],
    preferredFraming: body.preferredFraming ?? [],
    personaSummary: body.personaSummary || null,
  }).returning();
  return NextResponse.json(reviewer, { status: 201 });
}
