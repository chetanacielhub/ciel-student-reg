import { NextRequest, NextResponse } from "next/server";
import { addJourneyMilestone } from "@/lib/dynamic-store";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, stage, title, description, date, status, userEmail: bodyEmail } = body;

    if (!title || !stage) {
      return NextResponse.json({ error: "Title and Stage are required." }, { status: 400 });
    }

    let resolvedEmail = bodyEmail?.toLowerCase().trim();
    if (!resolvedEmail) {
      const cookieStore = await cookies();
      const sessionRaw = cookieStore.get("ciel_user_session")?.value;
      if (sessionRaw) {
        try {
          const decoded = decodeURIComponent(sessionRaw);
          const parsed = JSON.parse(decoded);
          if (parsed?.email) resolvedEmail = parsed.email.toLowerCase().trim();
        } catch {
          try {
            const parsed = JSON.parse(sessionRaw);
            if (parsed?.email) resolvedEmail = parsed.email.toLowerCase().trim();
          } catch { /* ignore */ }
        }
      }
    }

    const milestone = await addJourneyMilestone(
      projectId || `proj-${Date.now()}`,
      {
        stage: stage || "idea",
        title,
        description: description || "",
        date: date || new Date().toISOString().split("T")[0],
        status: status || "completed",
      },
      resolvedEmail
    );

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add journey milestone." }, { status: 500 });
  }
}
