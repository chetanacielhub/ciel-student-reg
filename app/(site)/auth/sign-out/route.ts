import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("ciel_user_session");

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
