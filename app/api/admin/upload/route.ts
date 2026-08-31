import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

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

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const safeName = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

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

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(safeName, buffer, {
          contentType: file.type || "image/jpeg",
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

    // 2. If on serverless without cloud storage, convert to Base64 data URL
    if (!uploadedToCloud) {
      const mime = file.type || "image/jpeg";
      finalUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    // 3. Try writing to public/uploads (works in local dev & persistent servers)
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, safeName), buffer);
      if (!uploadedToCloud && process.env.NODE_ENV !== "production") {
        finalUrl = `/uploads/${safeName}`;
      }
    } catch {
      // Ignore read-only filesystem error on serverless
    }

    return NextResponse.json({ url: finalUrl, filename: safeName }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload file." }, { status: 500 });
  }
}
