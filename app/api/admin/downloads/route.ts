import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { getDownloadDocs, addDownloadDoc, deleteDownloadDoc } from "@/lib/dynamic-store";

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
