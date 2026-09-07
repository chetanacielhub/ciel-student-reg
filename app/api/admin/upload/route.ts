import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const contentTypeHeader = req.headers.get("content-type") || "";
    let buffer: Buffer;
    let originalName = "";
    let mimeType = "";

    // 1. Direct binary upload (bypasses undici multipart/form-data 10MB limit)
    const headerFilename = req.headers.get("x-filename");
    if (headerFilename || !contentTypeHeader.includes("multipart/form-data")) {
      originalName = headerFilename ? decodeURIComponent(headerFilename) : `file-${Date.now()}`;
      mimeType = contentTypeHeader.split(";")[0] || "application/octet-stream";
      buffer = Buffer.from(await req.arrayBuffer());
    } else {
      // 2. Multipart form-data parser (for standard forms & image uploads <10MB)
      const formData = await req.formData();
      const file = (formData.get("video") || formData.get("file") || formData.get("image")) as File | null;

      if (!file || file.size === 0) {
        return NextResponse.json({ error: "No file provided." }, { status: 400 });
      }

      originalName = file.name;
      mimeType = file.type || "application/octet-stream";
      buffer = Buffer.from(await file.arrayBuffer());
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ error: "Empty file provided." }, { status: 400 });
    }

    if (buffer.length > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File size exceeds 100 MB limit." }, { status: 400 });
    }

    const isVideo = mimeType.startsWith("video/") || /\.(mp4|webm|ogg|mov|m4v|mkv)$/i.test(originalName);
    const isImage = mimeType.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(originalName);
    const isDoc = mimeType.startsWith("application/") || /\.(pdf|doc|docx|ppt|pptx|zip)$/i.test(originalName);

    if (!isVideo && !isImage && !isDoc) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload a video (MP4, WebM, MOV), image, or document." },
        { status: 400 }
      );
    }

    const ext = path.extname(originalName).toLowerCase() || (isVideo ? ".mp4" : ".jpg");
    const prefix = isVideo ? "video" : isImage ? "photo" : "doc";
    const safeName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    let finalUrl = `/uploads/${safeName}`;
    let uploadedToCloud = false;

    // 1. Try Supabase Storage
    try {
      const supabase = createAdminClient();
      const bucketName = "uploads";
      try {
        await supabase.storage.createBucket(bucketName, { public: true });
      } catch {
        // Bucket might exist
      }

      const contentType = mimeType || (isVideo ? "video/mp4" : isImage ? "image/jpeg" : "application/octet-stream");
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(safeName, buffer, {
          contentType,
          upsert: true,
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(safeName);
        if (publicUrl) {
          finalUrl = publicUrl;
          uploadedToCloud = true;
        }
      }
    } catch {
      // Ignore
    }

    // 2. Try writing to public/uploads (local dev & persistent servers)
    let writtenToDisk = false;
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, safeName), buffer);
      writtenToDisk = true;
    } catch {
      // Ignore read-only filesystem error on serverless
    }

    if (uploadedToCloud) {
      // already set to publicUrl
    } else if (writtenToDisk) {
      finalUrl = `/uploads/${safeName}`;
    } else {
      // Serverless without cloud fallback: base64
      const mime = mimeType || (isVideo ? "video/mp4" : "application/octet-stream");
      finalUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({ url: finalUrl, filename: safeName }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload file." }, { status: 500 });
  }
}
