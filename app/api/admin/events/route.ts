import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getCielEvents, addCielEvent, deleteCielEvent } from "@/lib/dynamic-store";

export async function GET() {
  const events = await getCielEvents();
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  await requireAdminSession();

  try {
    const body = await req.json();
    const { title, category, date, time, venue, desc, posterUrl } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and Date are required." }, { status: 400 });
    }

    const event = await addCielEvent({
      title,
      category: category || "Incubation Event",
      date,
      time: time || "Full Day",
      venue: venue || "CIEL Innovation Hub",
      desc: desc || "",
      posterUrl: posterUrl || "",
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add event." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await requireAdminSession();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    await deleteCielEvent(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete event." }, { status: 500 });
  }
}
