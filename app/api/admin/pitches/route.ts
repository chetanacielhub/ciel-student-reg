import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import {
  getElevatorPitches,
  addElevatorPitch,
  deleteElevatorPitch,
} from "@/lib/dynamic-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/admin/pitches — list all elevator pitches */
export async function GET() {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const pitches = await getElevatorPitches();
    return NextResponse.json({ success: true, pitches });
  } catch {
    return NextResponse.json({ error: "Failed to fetch pitches." }, { status: 500 });
  }
}

/** POST /api/admin/pitches — add a new elevator pitch */
export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { title, founder, startup, videoUrl, thumbnailUrl, description } = body;

    if (!title?.trim() || !founder?.trim() || !startup?.trim() || !videoUrl?.trim()) {
      return NextResponse.json(
        { error: "title, founder, startup, and videoUrl are required." },
        { status: 400 }
      );
    }

    const pitch = await addElevatorPitch({
      title: title.trim(),
      founder: founder.trim(),
      startup: startup.trim(),
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl?.trim() || undefined,
      description: description?.trim() || undefined,
    });

    return NextResponse.json({ success: true, pitch }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add pitch." }, { status: 500 });
  }
}

/** DELETE /api/admin/pitches?id=pitch-xxx — delete a pitch */
export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "No id provided." }, { status: 400 });
  }

  try {
    await deleteElevatorPitch(id);
    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: "Failed to delete pitch." }, { status: 500 });
  }
}
