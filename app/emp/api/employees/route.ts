import { NextResponse } from "next/server";
import { getEmpSession, getAuthorizedEmpUsers } from "@/lib/emp-auth";

export async function GET() {
  const session = await getEmpSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = getAuthorizedEmpUsers();
  const employees = users
    .filter((u) => u.role === "employee")
    .map(({ id, name, email }) => ({ id, name, email }));

  return NextResponse.json({ success: true, data: employees });
}
