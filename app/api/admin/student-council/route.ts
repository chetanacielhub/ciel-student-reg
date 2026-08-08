import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { addStudentCouncilLead, deleteStudentCouncilLead, getStudentCouncilLeads } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export async function GET() {
  const leads = await getStudentCouncilLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  await requireAdminSession();

  try {
    const body = await req.json();
    const { name, role, branch, year, avatar, linkedinUrl } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required." }, { status: 400 });
    }

    const newLead = await addStudentCouncilLead({
      name,
      role,
      branch: branch || "Technology & Engineering",
      year: year || "Final Year",
      avatar: avatar || name.split(" ").map((n: string) => n[0]).join(""),
      linkedinUrl: linkedinUrl || undefined,
    });

    revalidatePath("/student-council");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add council lead." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await requireAdminSession();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Lead ID/Name is required." }, { status: 400 });
  }

  await deleteStudentCouncilLead(id);

  revalidatePath("/student-council");
  revalidatePath("/admin/dashboard");

  return NextResponse.json({ ok: true });
}
