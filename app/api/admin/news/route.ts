import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { getNewsItems, addNewsItem, deleteNewsItem } from "@/lib/dynamic-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const news = await getNewsItems();
  return NextResponse.json({ news });
}

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { title, category, date, summary } = body;

    if (!title || !summary) {
      return NextResponse.json({ error: "Title and Summary are required." }, { status: 400 });
    }

    const item = await addNewsItem({
      title,
      category: category || "Announcement",
      date: date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      summary,
    });

    return NextResponse.json({ success: true, news: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add news item." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "News ID is required." }, { status: 400 });
    }

    await deleteNewsItem(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete news item." }, { status: 500 });
  }
}
