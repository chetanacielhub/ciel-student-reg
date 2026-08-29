import { NextRequest, NextResponse } from "next/server";
import { getEmpSession } from "@/lib/emp-auth";
import { getMonthlyReports, saveMonthlyReport, deleteMonthlyReport } from "@/lib/emp-store";

export async function GET(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedEmpId = searchParams.get("employee_id");
  const month = searchParams.get("month") || undefined;

  let empFilter: string | undefined = session.id;
  if (session.role === "admin") {
    empFilter = requestedEmpId || undefined;
  }

  const reports = await getMonthlyReports({
    employee_id: empFilter,
    month,
  });

  return NextResponse.json({ success: true, data: reports });
}

export async function POST(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      month,
      key_achievements,
      major_challenges,
      next_month_goals,
      learnings_skills,
      support_needed,
      notes,
      employee_id,
    } = body;

    if (!key_achievements || !key_achievements.trim()) {
      return NextResponse.json(
        { error: "Key achievements & deliverables are required for the monthly report." },
        { status: 400 }
      );
    }

    if (!next_month_goals || !next_month_goals.trim()) {
      return NextResponse.json(
        { error: "Next month goals & priorities are required." },
        { status: 400 }
      );
    }

    const targetEmpId = session.role === "admin" && employee_id ? employee_id : session.id;

    const saved = await saveMonthlyReport(targetEmpId, {
      month: month || new Date().toISOString().slice(0, 7),
      key_achievements: key_achievements.trim(),
      major_challenges: major_challenges ? major_challenges.trim() : "",
      next_month_goals: next_month_goals.trim(),
      learnings_skills: learnings_skills ? learnings_skills.trim() : "",
      support_needed: support_needed ? support_needed.trim() : "",
      notes: notes ? notes.trim() : "",
    });

    return NextResponse.json({ success: true, data: saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to save monthly report." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
  }

  const deleted = await deleteMonthlyReport(id, session.id);
  if (deleted) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Failed to delete monthly report" }, { status: 404 });
  }
}
