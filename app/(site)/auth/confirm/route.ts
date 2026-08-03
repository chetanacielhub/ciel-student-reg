import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/register";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const code = requestUrl.searchParams.get("code");
  const nextPath = safeNextPath(requestUrl.searchParams.get("next"));
  const supabase = await createClient();

  let error: Error | null = null;

  if (tokenHash && type) {
    const result = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    error = result.error;
  } else if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else {
    error = new Error("The confirmation link is missing its verification code.");
  }

  if (error) {
    const errorUrl = new URL("/auth/error", requestUrl.origin);
    errorUrl.searchParams.set("message", error.message);
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
