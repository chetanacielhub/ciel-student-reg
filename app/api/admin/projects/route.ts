import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { getVentureProjects, updateAdminProjectGrantStatus, updateVentureProject } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const projects = await getVentureProjects();
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { projectId, grantStatus, reviewerNotes, stage, progress } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    if (stage || typeof progress === "number") {
      await updateVentureProject(projectId, { stage, progress });
    }

    const updated = await updateAdminProjectGrantStatus(projectId, {
      grantStatus,
      reviewerNotes,
      stage,
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project." }, { status: 500 });
  }
}
