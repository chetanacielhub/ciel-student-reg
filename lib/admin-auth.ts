import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ciel_admin_session";
const SESSION_TOKEN = "authenticated"; // simple flag

/** Credentials come from env, with safe defaults */
export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "ciel@2026",
  };
}

/** Returns true if the admin session cookie is valid */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === SESSION_TOKEN;
}

/** Redirect to admin login if not authenticated (For page server components) */
export async function requireAdminSession() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin");
  }
}

/** For Route Handlers: Returns a 401 NextResponse if unauthorized, or null if authenticated */
export async function verifyAdminApiSession(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }
  return null;
}

export { COOKIE_NAME, SESSION_TOKEN };
