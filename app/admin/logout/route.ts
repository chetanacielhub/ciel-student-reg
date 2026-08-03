import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
