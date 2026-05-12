import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(projects).orderBy(projects.createdAt);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [project] = await db
    .insert(projects)
    .values({ name: body.name, description: body.description || null })
    .returning();
  return NextResponse.json(project, { status: 201 });
}
