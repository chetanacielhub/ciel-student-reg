import { NextRequest, NextResponse } from "next/server";
import { getEmpSession } from "@/lib/emp-auth";
import { getDailyUpdates, saveDailyUpdate } from "@/lib/emp-store";

export async function GET(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedEmpId = searchParams.get("employee_id");
  const date = searchParams.get("date") || undefined;

  let empFilter = session.id;
  if (session.role === "admin") {
    empFilter = requestedEmpId || undefined!;
  }

  const updates = await getDailyUpdates({
    employee_id: empFilter,
    date,
  });

  return NextResponse.json({ success: true, data: updates });
}

export async function POST(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { work_completed, blockers, tomorrow_plan, notes, date } = body;

    if (!work_completed || !work_completed.trim()) {
      return NextResponse.json(
        { error: "Work completed summary is required." },
        { status: 400 }
      );
    }

    const saved = await saveDailyUpdate(session.id, {
      work_completed: work_completed.trim(),
      blockers: blockers || "",
      tomorrow_plan: tomorrow_plan || "",
      notes: notes || "",
      date,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to save daily update." },
      { status: 500 }
    );
  }
}
