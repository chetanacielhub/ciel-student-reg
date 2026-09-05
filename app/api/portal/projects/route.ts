import { NextRequest, NextResponse } from "next/server";
import { getVentureProjectForUser, updateVentureProject } from "@/lib/dynamic-store";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get("email")?.toLowerCase().trim();
    const queryTeamId = searchParams.get("teamId") || undefined;

    let userEmail: string | null = queryEmail || null;

    if (!userEmail) {
      const cookieStore = await cookies();
      const sessionRaw = cookieStore.get("ciel_user_session")?.value;
      if (sessionRaw) {
        try {
          const decoded = decodeURIComponent(sessionRaw);
          const parsed = JSON.parse(decoded);
          if (parsed?.email) userEmail = parsed.email.toLowerCase().trim();
        } catch {
          try {
            const parsed = JSON.parse(sessionRaw);
            if (parsed?.email) userEmail = parsed.email.toLowerCase().trim();
          } catch { /* ignore */ }
        }
      }
    }

    const project = await getVentureProjectForUser(userEmail, queryTeamId);

    // Return the individual person's project only, never a shared foreign project
    return NextResponse.json({ project: project || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch project." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      problemStatement,
      stage,
      progress,
      pitchDeck,
      documents,
      traction,
      teamName,
      leaderEmail,
      leaderName,
    } = body;

    let resolvedEmail = leaderEmail?.toLowerCase().trim();
    if (!resolvedEmail) {
      const cookieStore = await cookies();
      const sessionRaw = cookieStore.get("ciel_user_session")?.value;
      if (sessionRaw) {
        try {
          const decoded = decodeURIComponent(sessionRaw);
          const parsed = JSON.parse(decoded);
          if (parsed?.email) resolvedEmail = parsed.email.toLowerCase().trim();
        } catch { /* ignore */ }
      }
    }

    const updated = await updateVentureProject(id || `proj-${Date.now()}`, {
      name,
      teamName,
      problemStatement,
      stage,
      progress: typeof progress === "number" ? progress : undefined,
      pitchDeck,
      documents,
      traction,
      leaderEmail: resolvedEmail,
      leaderName,
    });

    if (!updated) {
      return NextResponse.json({ error: "Project not found to update." }, { status: 404 });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project." }, { status: 500 });
  }
}
