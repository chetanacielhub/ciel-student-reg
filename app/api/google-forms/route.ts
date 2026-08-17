import { NextResponse } from "next/server";
import { getGoogleForms } from "@/lib/dynamic-store";

export async function GET() {
  try {
    const forms = await getGoogleForms(true); // only active forms for public site
    return NextResponse.json({ forms });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch Google Forms." },
      { status: 500 }
    );
  }
}
