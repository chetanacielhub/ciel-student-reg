import { NextRequest, NextResponse } from "next/server";
import { getEmpSession } from "@/lib/emp-auth";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  TaskStatus,
  TaskPriority,
} from "@/lib/emp-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedEmpId = searchParams.get("employee_id");
  const date = searchParams.get("date") || undefined;
  const status = (searchParams.get("status") as TaskStatus) || undefined;
  const priority = (searchParams.get("priority") as TaskPriority) || undefined;

  let empFilter: string | undefined = session.id;
  if (session.role === "admin") {
    empFilter = requestedEmpId && requestedEmpId !== "all" ? requestedEmpId : undefined;
  }

  const tasks = await getTasks({
    employee_id: empFilter,
    date,
    status,
    priority,
  });

  return NextResponse.json(
    { success: true, data: tasks },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, priority, status, date, employee_id } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      );
    }

    const targetEmpId = session.role === "admin" && employee_id ? employee_id : session.id;

    const newTask = await createTask(
      targetEmpId,
      title.trim(),
      description ? description.trim() : "",
      priority || "Medium",
      status || "Pending",
      date
    );

    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("Failed to create task:", err);
    return NextResponse.json({ error: err?.message || "Failed to create task." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, status, priority, date, employee_id } = body;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (date !== undefined) updates.date = date;
    if (session.role === "admin" && employee_id !== undefined) updates.employee_id = employee_id;

    const updated = await updateTask(id, session.id, updates);

    if (!updated) {
      return NextResponse.json(
        { error: "Task not found or forbidden to edit." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("Failed to update task:", err);
    return NextResponse.json({ error: err?.message || "Failed to update task." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
    }

    const ok = await deleteTask(id, session.id);
    if (!ok) {
      return NextResponse.json(
        { error: "Task not found or forbidden to delete." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("Failed to delete task:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete task." }, { status: 500 });
  }
}
