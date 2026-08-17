import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getGoogleForms, addGoogleForm, updateGoogleForm, deleteGoogleForm } from "@/lib/dynamic-store";

export async function GET() {
  await requireAdminSession();
  try {
    const forms = await getGoogleForms(false); // return all forms including inactive for admin
    return NextResponse.json({ forms });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch Google Forms." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await requireAdminSession();
  try {
    const body = await req.json();
    const { title, description, category, formUrl, embedUrl, isActive } = body;

    if (!title || !formUrl) {
      return NextResponse.json({ error: "Form Title and Google Form URL are required." }, { status: 400 });
    }

    const form = await addGoogleForm({
      title,
      description,
      category: category || "General",
      formUrl,
      embedUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, form }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add Google Form." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await requireAdminSession();
  try {
    const body = await req.json();
    const { id, title, description, category, formUrl, embedUrl, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Form ID is required for update." }, { status: 400 });
    }

    const updated = await updateGoogleForm(id, {
      title,
      description,
      category,
      formUrl,
      embedUrl,
      isActive,
    });

    if (!updated) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, form: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update Google Form." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await requireAdminSession();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Form ID is required for deletion." }, { status: 400 });
    }

    await deleteGoogleForm(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete Google Form." }, { status: 500 });
  }
}
