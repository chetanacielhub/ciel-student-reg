import { NextRequest, NextResponse } from "next/server";
import { getAdminCredentials, COOKIE_NAME, SESSION_TOKEN } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = (formData.get("username") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const creds = getAdminCredentials();

  if (username !== creds.username || password !== creds.password) {
    return NextResponse.redirect(new URL("/admin?error=invalid", req.url), {
      status: 303,
    });
  }

  const response = NextResponse.redirect(new URL("/admin/dashboard", req.url), {
    status: 303,
  });

  // Secure HttpOnly session cookie (expires in 8 hours)
  response.cookies.set(COOKIE_NAME, SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
