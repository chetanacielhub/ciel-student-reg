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

    // 1. Save credentials to local store FIRST (guaranteed persistence)
    const { addStoreProfile } = await import("@/lib/dynamic-store");
    await addStoreProfile({
      id: `usr-${Date.now()}`,
      full_name: fullName,
      email: email.toLowerCase(),
      phone,
      password,
      created_at: new Date().toISOString(),
    });

    // 2. Try creating user in Supabase Auth (may fail without service role key)
    let userId: string | undefined;
    try {
      const adminSupabase = createAdminClient();
      const { data: adminData, error: adminError } =
        await adminSupabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName, phone },
        });

      if (!adminError) {
        userId = adminData.user?.id;
      }
      // If "already registered", that's fine — user can sign in with existing account
    } catch {
      // Supabase admin not available — local store is the source of truth
    }

    // 3. Try signing user in via SSR client to set Supabase session cookies
    const cookieStore = await cookies();
    try {
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
                // Ignore
              }
            },
          },
        }
      );

      await ssrSupabase.auth.signInWithPassword({ email, password });
    } catch {
      // Supabase sign-in may fail — that's okay, we use session cookie
    }

    // 4. Always set our own persistent session cookie
    const sessionData = {
      id: userId || `usr-${Date.now()}`,
      email: email.toLowerCase(),
      fullName,
      loggedInAt: new Date().toISOString(),
    };

    cookieStore.set("ciel_user_session", JSON.stringify(sessionData), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      redirect: "/dashboard",
      user: sessionData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to register user." },
      { status: 500 }
    );
  }
}
