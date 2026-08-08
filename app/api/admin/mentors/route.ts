import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { addMentor, deleteMentor, getMentors } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export async function GET() {
  const mentors = await getMentors();
  return NextResponse.json(mentors);
}

export async function POST(req: NextRequest) {
  await requireAdminSession();

  try {
    const body = await req.json();
    const { name, designation, organization, category, expertise, avatar, linkedinUrl } = body;

    if (!name || !designation) {
      return NextResponse.json({ error: "Name and designation are required." }, { status: 400 });
    }

    const expertiseArray = Array.isArray(expertise)
      ? expertise
      : typeof expertise === "string"
      ? expertise.split(",").map((e: string) => e.trim()).filter(Boolean)
      : [];

    const newMentor = await addMentor({
      name,
      designation,
      organization: organization || "CIEL Advisor Network",
      category: category || "industry",
      expertise: expertiseArray.length > 0 ? expertiseArray : ["Incubation", "Strategic Guidance"],
      avatar: avatar || name.split(" ").map((n: string) => n[0]).join(""),
      linkedinUrl: linkedinUrl || undefined,
    });

    revalidatePath("/mentors");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(newMentor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add mentor." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await requireAdminSession();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Mentor ID is required." }, { status: 400 });
  }

  await deleteMentor(id);

  revalidatePath("/mentors");
  revalidatePath("/admin/dashboard");

  return NextResponse.json({ ok: true });
}
