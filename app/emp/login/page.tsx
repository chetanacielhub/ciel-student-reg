import { redirect } from "next/navigation";
import { getEmpSession } from "@/lib/emp-auth";
import EmpLoginForm from "../emp-login-form";

export default async function EmpLoginPage() {
  const session = await getEmpSession();

  if (session) {
    if (session.role === "admin") {
      redirect("/emp/admin");
    } else {
      redirect("/emp/dashboard");
    }
  }

  return <EmpLoginForm />;
}
