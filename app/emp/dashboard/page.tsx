import { redirect } from "next/navigation";
import { getEmpSession } from "@/lib/emp-auth";
import EmployeeDashboardClient from "./employee-dashboard-client";

export default async function EmployeeDashboardPage() {
  const session = await getEmpSession();

  if (!session) {
    redirect("/emp/login");
  }

  if (session.role === "admin") {
    redirect("/emp/admin");
  }

  return <EmployeeDashboardClient user={session} />;
}
