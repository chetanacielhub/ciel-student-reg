import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import path from "path";
import fs from "fs/promises";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

async function ensureGalleryDir() {
  await fs.mkdir(GALLERY_DIR, { recursive: true });
}

/** POST /admin/gallery — upload a new image */
export async function POST(req: NextRequest) {
  await requireAdminSession();

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, GIF and AVIF are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 10 MB." },
      { status: 400 }
    );
  }

  await ensureGalleryDir();

  // Build a safe, unique filename
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(GALLERY_DIR, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ filename: safeName }, { status: 201 });
}

/** DELETE /admin/gallery?file=filename.jpg — remove an image */
export async function DELETE(req: NextRequest) {
  await requireAdminSession();

  const filename = req.nextUrl.searchParams.get("file");
  if (!filename) {
    return NextResponse.json({ error: "No filename provided." }, { status: 400 });
  }

  // Prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(GALLERY_DIR, safeName);

  try {
    await fs.unlink(filePath);
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
