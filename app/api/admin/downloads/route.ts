import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { getDownloadDocs, addDownloadDoc, deleteDownloadDoc, updateDownloadDoc } from "@/lib/dynamic-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const downloads = await getDownloadDocs();
  return NextResponse.json({ downloads });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { title, category, fileSize, format, description, fileUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and Description are required." }, { status: 400 });
    }

    const doc = await addDownloadDoc({
      title,
      category: category || "policy",
      fileSize: fileSize || "1.5 MB",
      format: format || "PDF",
      updatedAt: new Date().toISOString().split("T")[0],
      description,
      fileUrl: fileUrl || "",
    });

    return NextResponse.json({ success: true, download: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add policy document." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { id, title, category, fileSize, format, description, fileUrl } = body;

    if (!id) {
      return NextResponse.json({ error: "Document ID is required." }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (fileSize !== undefined) updates.fileSize = fileSize;
    if (format !== undefined) updates.format = format;
    if (description !== undefined) updates.description = description;
    if (fileUrl !== undefined) updates.fileUrl = fileUrl;

    const doc = await updateDownloadDoc(id, updates);
    if (!doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, download: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update policy document." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID is required." }, { status: 400 });
    }

    await deleteDownloadDoc(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete policy document." }, { status: 500 });
  }
}

