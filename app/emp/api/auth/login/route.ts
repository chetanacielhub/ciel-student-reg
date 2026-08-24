import { NextRequest, NextResponse } from "next/server";
import {
  authenticateEmpCredentials,
  createSessionToken,
  COOKIE_NAME,
} from "@/lib/emp-auth";

export async function POST(req: NextRequest) {
  try {
    let email = "";
    let password = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email || body.username || "";
      password = body.password || "";
    } else {
      const formData = await req.formData();
      email = (formData.get("email") as string) || (formData.get("username") as string) || "";
      password = (formData.get("password") as string) || "";
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/Username and password are required." },
        { status: 400 }
      );
    }

    const user = authenticateEmpCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Unauthorized user." },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const redirectUrl = user.role === "admin" ? "/emp/admin" : "/emp/dashboard";

    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
