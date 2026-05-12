import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reviewers } from "@/db/schema";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [reviewer] = await db.select().from(reviewers).where(eq(reviewers.id, id));
  if (!reviewer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(reviewer);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db
    .update(reviewers)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(reviewers.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(reviewers).where(eq(reviewers.id, id));
  return new NextResponse(null, { status: 204 });
}
