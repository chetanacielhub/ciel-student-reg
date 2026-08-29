import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, rollNumber, institutionName } = body;

    const cookieStore = await cookies();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      const ssrSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
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

      const { data: { user } } = await ssrSupabase.auth.getUser();

      if (user) {
        if (fullName !== undefined || phone !== undefined) {
          await ssrSupabase
            .from("profiles")
            .update({
              full_name: fullName,
              phone: phone,
            })
            .eq("id", user.id);
        }

        if (rollNumber !== undefined) {
          await ssrSupabase
            .from("event_registrations")
            .update({
              roll_number: rollNumber,
            })
            .eq("user_id", user.id);
        }
      }
    }

    revalidatePath("/dashboard");
    return NextResponse.json({
      success: true,
      profile: {
        full_name: fullName,
        phone,
      },
      registration: {
        roll_number: rollNumber,
        institutionName,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile details." },
      { status: 500 }
    );
  }
}
