import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const { filename, contentType } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: "Filename is required." }, { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase() || ".mp4";
    const isVideo = contentType?.startsWith("video/") || /\.(mp4|webm|ogg|mov|m4v|mkv)$/i.test(filename);
    const prefix = isVideo ? "video" : "file";
    const safeName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const supabase = createAdminClient();
    const bucketName = "uploads";

    // Ensure bucket exists
    try {
      await supabase.storage.createBucket(bucketName, { public: true });
    } catch {
      // Bucket might exist
    }

    // Generate signed upload URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(safeName);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to create signed upload URL in Supabase." },
        { status: 500 }
      );
    }

    const { data: pub } = supabase.storage.from(bucketName).getPublicUrl(safeName);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: pub.publicUrl,
      filename: safeName,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate upload URL." }, { status: 500 });
  }
}
