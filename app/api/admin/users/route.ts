import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import { getStoreProfiles, deleteStoreProfile, updateStoreProfileStatus } from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const profiles = await getStoreProfiles();
    return NextResponse.json({ profiles });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch user profiles." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");
    let email = searchParams.get("email");

    if (!id && !email) {
      try {
        const body = await req.json();
        id = body.id;
        email = body.email;
      } catch {
        // No json body
      }
    }

    if (!id && !email) {
      return NextResponse.json({ error: "User ID or Email is required for deletion." }, { status: 400 });
    }

    await deleteStoreProfile(id || "", email || null);

    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete user." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { id, status, email } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (status !== "active" && status !== "suspended" && status !== "pending") {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    await updateStoreProfileStatus(id, status, email || null);

    revalidatePath("/admin/dashboard");
    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update user status." },
      { status: 500 }
    );
  }
}
