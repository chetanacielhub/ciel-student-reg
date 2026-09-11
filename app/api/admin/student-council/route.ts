import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { addStudentCouncilLead, deleteStudentCouncilLead, getStudentCouncilLeads, updateStudentCouncilLead } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const leads = await getStudentCouncilLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { name, role, branch, year, avatar, linkedinUrl, category, institute } = body;

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
      category: category === "functional" ? "functional" : "council",
      institute: institute || undefined,
    });

    revalidatePath("/student-council");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add council lead." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { id, name, role, branch, year, avatar, linkedinUrl, category, institute } = body;

    if (!id) {
      return NextResponse.json({ error: "Council Lead ID is required." }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (branch !== undefined) updates.branch = branch;
    if (year !== undefined) updates.year = year;
    if (avatar !== undefined) updates.avatar = avatar;
    if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl;
    if (category !== undefined) updates.category = category;
    if (institute !== undefined) updates.institute = institute;

    const updated = await updateStudentCouncilLead(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Council lead not found." }, { status: 404 });
    }

    revalidatePath("/student-council");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update council lead." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Lead ID/Name is required." }, { status: 400 });
  }

  await deleteStudentCouncilLead(id);

  revalidatePath("/student-council");
  revalidatePath("/admin/dashboard");

  return NextResponse.json({ ok: true });
}

