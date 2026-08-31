import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
} from "@/lib/dynamic-store";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg", ".bmp", ".jfif"];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/** GET /api/admin/gallery — list all images */
export async function GET() {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const images = await getGalleryImages();
    return NextResponse.json({ success: true, images });
  } catch {
    return NextResponse.json({ error: "Failed to list gallery images." }, { status: 500 });
  }
}

/** POST /api/admin/gallery — upload one or more images */
export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

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

    const uploadedResults: Array<{ filename: string; url: string }> = [];

    for (const file of validFiles) {
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const isAllowedExt = ALLOWED_EXTS.includes(ext);
      const isImageMime = file.type ? file.type.startsWith("image/") : false;

      if (!isAllowedExt && !isImageMime) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a recognized image format.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 25 MB size limit.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const savedImg = await addGalleryImage({
        name: file.name,
        type: file.type || "image/jpeg",
        buffer,
      });

      uploadedResults.push({
        filename: savedImg.filename,
        url: savedImg.url,
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

/** DELETE /api/admin/gallery?file=filename.jpg — remove an image */
export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  const filename = req.nextUrl.searchParams.get("file");
  if (!filename) {
    return NextResponse.json({ error: "No filename provided." }, { status: 400 });
  }

  try {
    await deleteGalleryImage(filename);
    return NextResponse.json({ success: true, ok: true, filename });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "File could not be removed." }, { status: 500 });
  }
}
