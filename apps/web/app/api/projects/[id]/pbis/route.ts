import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pbis } from "@/db/schema";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await db.select().from(pbis).where(eq(pbis.projectId, id));
  return NextResponse.json(data);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [pbi] = await db
    .insert(pbis)
    .values({
      projectId: id,
      title: body.title,
      problemStatement: body.problemStatement || null,
      whyItMatters: body.whyItMatters || null,
      appetite: body.appetite || null,
      constraints: body.constraints || null,
      dependencies: body.dependencies || null,
      successMetrics: body.successMetrics || null,
    })
    .returning();
  return NextResponse.json(pbi, { status: 201 });
}
