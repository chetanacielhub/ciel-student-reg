import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiSession } from "@/lib/admin-auth";
import {
  addGovernanceCommittee,
  addGovernanceMember,
  deleteGovernanceCommittee,
  deleteGovernanceMember,
  getGovernanceCommittees,
  updateGovernanceMember,
  updateGovernanceCommittee,
} from "@/lib/dynamic-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const committees = await getGovernanceCommittees();
  return NextResponse.json(committees);
}

export async function POST(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { action, committeeName, description, memberName, role, linkedinUrl, avatar } = body;

    if (action === "add_committee") {
      if (!committeeName) {
        return NextResponse.json({ error: "Committee name is required." }, { status: 400 });
      }
      const comm = await addGovernanceCommittee({
        name: committeeName,
        description: description || "CIEL Standing Governance Committee",
      });

      revalidatePath("/governance");
      revalidatePath("/admin/dashboard");
      return NextResponse.json(comm, { status: 201 });
    }

    if (action === "add_member" || !action) {
      if (!committeeName || !memberName || !role) {
        return NextResponse.json({ error: "Committee name, member name, and role are required." }, { status: 400 });
      }

      await addGovernanceMember(committeeName, {
        name: memberName,
        role,
        linkedinUrl: linkedinUrl || undefined,
        avatar: avatar || undefined,
      });

      revalidatePath("/governance");
      revalidatePath("/admin/dashboard");
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process governance request." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { action, committeeName, originalCommitteeName, description, memberName, originalMemberName, role, linkedinUrl, avatar } = body;

    if (action === "update_committee") {
      const targetName = originalCommitteeName || committeeName;
      if (!targetName) {
        return NextResponse.json({ error: "Committee name is required." }, { status: 400 });
      }
      const success = await updateGovernanceCommittee(targetName, {
        name: committeeName,
        description,
      });
      if (!success) {
        return NextResponse.json({ error: "Committee not found." }, { status: 404 });
      }
      revalidatePath("/governance");
      revalidatePath("/admin/dashboard");
      return NextResponse.json({ ok: true });
    }

    // Default: update member
    const commName = committeeName;
    const origName = originalMemberName || memberName;
    if (!commName || !origName) {
      return NextResponse.json({ error: "Committee name and original member name are required." }, { status: 400 });
    }

    const success = await updateGovernanceMember(commName, origName, {
      name: memberName,
      role,
      avatar,
      linkedinUrl,
    });

    if (!success) {
      return NextResponse.json({ error: "Governance member or committee not found." }, { status: 404 });
    }

    revalidatePath("/governance");
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update governance entity." }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const authErr = await verifyAdminApiSession();
  if (authErr) return authErr;

  const type = req.nextUrl.searchParams.get("type"); // "member" or "committee"
  const committeeName = req.nextUrl.searchParams.get("committee");
  const memberName = req.nextUrl.searchParams.get("member");

  if (type === "committee" && committeeName) {
    await deleteGovernanceCommittee(committeeName);
  } else if (committeeName && memberName) {
    await deleteGovernanceMember(committeeName, memberName);
  } else {
    return NextResponse.json({ error: "Invalid deletion query parameters." }, { status: 400 });
  }

  revalidatePath("/governance");
  revalidatePath("/admin/dashboard");

  return NextResponse.json({ ok: true });
}
