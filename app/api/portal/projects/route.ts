import { NextRequest, NextResponse } from "next/server";
import { getVentureProjects, updateVentureProject } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const projects = await getVentureProjects();
    const project = projects[0] || null;
    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch project." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, problemStatement, stage, progress, pitchDeck } = body;

    const updated = await updateVentureProject(id || "proj-1", {
      name,
      problemStatement,
      stage,
      progress: typeof progress === "number" ? progress : undefined,
      pitchDeck,
    });

    if (!updated) {
      return NextResponse.json({ error: "Project not found to update." }, { status: 44 });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project." }, { status: 500 });
  }
}
