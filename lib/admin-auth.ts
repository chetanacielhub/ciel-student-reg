import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

/** Redirect to admin login if not authenticated */
export async function requireAdminSession() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin");
  }
}

export { COOKIE_NAME, SESSION_TOKEN };
