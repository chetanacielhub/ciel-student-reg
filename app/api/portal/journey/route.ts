import { NextRequest, NextResponse } from "next/server";
import { addJourneyMilestone } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, stage, title, description, date, status } = body;

    if (!title || !stage) {
      return NextResponse.json({ error: "Title and Stage are required." }, { status: 400 });
    }

    const milestone = await addJourneyMilestone(projectId || "proj-1", {
      stage: stage || "idea",
      title,
      description: description || "",
      date: date || new Date().toISOString().split("T")[0],
      status: status || "completed",
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add journey milestone." }, { status: 500 });
  }
}
