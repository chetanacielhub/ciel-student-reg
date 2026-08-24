import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/emp-auth";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, redirectUrl: "/emp/login" });

  // Clear session cookie
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
