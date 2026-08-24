import { redirect } from "next/navigation";
import { getEmpSession } from "@/lib/emp-auth";

export default async function EmpPage() {
  const session = await getEmpSession();

  if (!session) {
    redirect("/emp/login");
  }

  if (session.role === "admin") {
    redirect("/emp/admin");
  } else {
    redirect("/emp/dashboard");
  }
}
