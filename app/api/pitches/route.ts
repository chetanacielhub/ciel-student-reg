import { NextResponse } from "next/server";
import { getElevatorPitches } from "@/lib/dynamic-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/pitches — public endpoint, no auth required */
export async function GET() {
  try {
    const pitches = await getElevatorPitches();
    return NextResponse.json({ success: true, pitches });
  } catch {
    return NextResponse.json({ success: true, pitches: [] });
  }
}
