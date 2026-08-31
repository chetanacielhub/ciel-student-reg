import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg", ".bmp", ".jfif"];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

async function ensureGalleryDir() {
  await fs.mkdir(GALLERY_DIR, { recursive: true });
}

/** GET /admin/gallery — list all images */
export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureGalleryDir();

  try {
    const files = await fs.readdir(GALLERY_DIR);
    const images = files
      .filter((f) => !f.startsWith(".") && /\.(jpe?g|png|webp|gif|avif|svg|bmp|jfif)$/i.test(f))
      .map((filename) => ({
        filename,
        url: `/gallery/${filename}`,
      }));
    return NextResponse.json({ success: true, images });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to list gallery images." }, { status: 500 });
  }
}

/** POST /admin/gallery — upload one or more images */
export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const allFiles = [
      ...formData.getAll("image"),
      ...formData.getAll("images"),
      ...formData.getAll("file"),
    ] as File[];

    const validFiles = allFiles.filter(
      (f) => f && typeof f !== "string" && typeof f.arrayBuffer === "function" && f.size > 0
    );

    if (validFiles.length === 0) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    await ensureGalleryDir();

    const uploadedResults: Array<{ filename: string; url: string }> = [];

    for (const file of validFiles) {
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const isAllowedExt = ALLOWED_EXTS.includes(ext);
      const isImageMime = file.type ? file.type.startsWith("image/") : false;

      if (!isAllowedExt && !isImageMime) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a recognized image format. Allowed: JPG, PNG, WEBP, GIF, AVIF, SVG.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 25 MB size limit.` },
          { status: 400 }
        );
      }

      // Generate a clean, unique filename
      const baseOriginalName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 30);
      const safeName = `${Date.now()}-${baseOriginalName || "img"}${ext}`;
      const filePath = path.join(GALLERY_DIR, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      uploadedResults.push({
        filename: safeName,
        url: `/gallery/${safeName}`,
      });
    }

    return NextResponse.json(
      {
        success: true,
        ok: true,
        filename: uploadedResults[0].filename,
        url: uploadedResults[0].url,
        files: uploadedResults,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}

/** DELETE /admin/gallery?file=filename.jpg — remove an image */
export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  const filename = req.nextUrl.searchParams.get("file");
  if (!filename) {
    return NextResponse.json({ error: "No filename provided." }, { status: 400 });
  }

  // Prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(GALLERY_DIR, safeName);

  try {
    await fs.unlink(filePath);
    return NextResponse.json({ success: true, ok: true, filename: safeName });
  } catch {
    return NextResponse.json({ error: "File not found or could not be removed." }, { status: 404 });
  }
}
