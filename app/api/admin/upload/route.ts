import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (file.type && !file.type.startsWith("image/") && !file.type.startsWith("application/")) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload an image or document file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File size exceeds 25 MB limit." }, { status: 400 });
    }

    await ensureUploadDir();

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const safeName = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;
    return NextResponse.json({ url, filename: safeName }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload image." }, { status: 500 });
  }
}
