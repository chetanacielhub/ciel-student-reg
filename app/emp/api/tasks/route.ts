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

  let empFilter = session.id;
  if (session.role === "admin") {
    empFilter = requestedEmpId || undefined!;
  }

  const tasks = await getTasks({
    employee_id: empFilter,
    date,
    status,
    priority,
  });

  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, priority, status, date } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      );
    }

    const newTask = await createTask(
      session.id,
      title.trim(),
      description || "",
      priority || "Medium",
      status || "Pending",
      date
    );

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, status, priority } = body;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
    }

    // Verify employee owns task
    const updated = await updateTask(id, session.id, {
      title,
      description,
      status,
      priority,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Task not found or forbidden to edit." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 });
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete task." }, { status: 500 });
  }
}
