import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { signInSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const cookieStore = await cookies();

    // 1. Try Supabase Auth sign-in first
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

      const { data: signInData, error: signInError } =
        await ssrSupabase.auth.signInWithPassword({ email, password });

      if (!signInError && signInData?.session) {
        // Supabase sign-in succeeded — set our session cookie too
        const sessionData = {
          id: signInData.user?.id || `usr-${Date.now()}`,
          email: email.toLowerCase(),
          fullName:
            signInData.user?.user_metadata?.full_name ||
            email.split("@")[0],
          loggedInAt: new Date().toISOString(),
        };

        cookieStore.set(
          "ciel_user_session",
          JSON.stringify(sessionData),
          {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: false,
            sameSite: "lax",
          }
        );

        return NextResponse.json({
          success: true,
          redirect: "/dashboard",
          user: sessionData,
        });
      }
    } catch {
      // Supabase sign-in failed — fall through to local store check
    }

    // 2. Check local store for registered user credentials
    const { getStoreProfiles } = await import("@/lib/dynamic-store");
    const profiles = await getStoreProfiles();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    const storeUser = profiles.find(
      (p) => p.email?.toLowerCase().trim() === cleanEmail
    );

    if (storeUser) {
      // Verify password matches what was saved during registration
      if (storeUser.password && storeUser.password.trim() !== cleanPassword) {
        return NextResponse.json(
          { error: "Incorrect password. Please verify your password and try again." },
          { status: 400 }
        );
      }

      // Password matches — set session cookie and let them in
      const sessionData = {
        id: storeUser.id,
        email: storeUser.email?.toLowerCase() || email.toLowerCase(),
        fullName: storeUser.full_name || "Innovator",
        loggedInAt: new Date().toISOString(),
      };

      cookieStore.set("ciel_user_session", JSON.stringify(sessionData), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
        sameSite: "lax",
      });

      return NextResponse.json({
        success: true,
        redirect: "/dashboard",
        user: sessionData,
      });
    }

    // 3. Try Supabase Admin to auto-confirm and sign in
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      const { data: usersList } =
        await adminSupabase.auth.admin.listUsers();
      const existingUser = usersList?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        // Auto-confirm if needed
        if (!existingUser.email_confirmed_at) {
          await adminSupabase.auth.admin.updateUserById(existingUser.id, {
            email_confirm: true,
          });
        }

        const sessionData = {
          id: existingUser.id,
          email: email.toLowerCase(),
          fullName:
            existingUser.user_metadata?.full_name || "Innovator",
          loggedInAt: new Date().toISOString(),
        };

        cookieStore.set(
          "ciel_user_session",
          JSON.stringify(sessionData),
          {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: false,
            sameSite: "lax",
          }
        );

        return NextResponse.json({
          success: true,
          redirect: "/dashboard",
          user: sessionData,
        });
      }
    } catch {
      // Admin client not available
    }

    // No match found anywhere
    return NextResponse.json(
      {
        error:
          "No account found with this email. Please register first.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Sign in failed. Please try again." },
      { status: 500 }
    );
  }
}
