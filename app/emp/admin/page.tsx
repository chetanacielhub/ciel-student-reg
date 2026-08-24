import { redirect } from "next/navigation";
import { getEmpSession } from "@/lib/emp-auth";
import EmployeeAdminClient from "./employee-admin-client";

export default async function EmployeeAdminPage() {
  const session = await getEmpSession();

  if (!session) {
    redirect("/emp/login");
  }

  // Enforce Employee Admin role ONLY
  if (session.role !== "admin") {
    redirect("/emp/dashboard");
  }

  return <EmployeeAdminClient adminUser={session} />;
}
