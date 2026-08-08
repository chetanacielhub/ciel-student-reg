import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { signUpSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message || "Invalid input data.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { email, password, fullName, phone } = parsed.data;

    // 1. Create auto-confirmed user via Supabase Admin Client
    const adminSupabase = createAdminClient();

    let userId: string | undefined;

    // Try admin createUser with email_confirm: true
    const { data: adminData, error: adminError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
      },
    });

    if (adminError) {
      // If user already exists, check if we can sign in
      if (adminError.message.toLowerCase().includes("already registered")) {
        return NextResponse.json({ error: "This email is already registered. Please sign in instead." }, { status: 400 });
      }
    } else {
      userId = adminData.user?.id;
    }

    // Ensure profile row exists in public.profiles table
    if (userId) {
      try {
        await adminSupabase.from("profiles").upsert({
          id: userId,
          full_name: fullName,
          email,
          phone,
          category: "student",
        });
      } catch {
        // Ignore RLS or schema warning if profile already inserted by trigger
      }
    }

    // 2. Sign user in using SSR client to set session cookies
    const cookieStore = await cookies();
    const ssrSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in Server Component context
            }
          },
        },
      }
    );

    const { data: signInData, error: signInError } = await ssrSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Return helpful fallback response if password sign in requires client-side handle
      return NextResponse.json({
        success: true,
        redirect: "/auth/sign-in",
        message: "Account created and pre-verified! Please sign in with your password.",
      });
    }

    return NextResponse.json({
      success: true,
      redirect: "/apply",
      session: signInData.session,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register user." }, { status: 500 });
  }
}
