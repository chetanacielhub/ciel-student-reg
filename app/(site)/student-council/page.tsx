import type { Metadata } from "next";
import { getInstitutesCouncilData } from "@/lib/dynamic-store";
import { StudentCouncilClientView } from "@/components/student-council/student-council-client-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Innovation Council & Student Functional Committee | CIEL",
  description:
    "Explore the dedicated Student Innovation Council (SIC) and Student Functional Committee across all 4 Chetana institutes: CIMR, CRKIMR, Chetana's SFC, and H.S. College of Commerce & Smt. Kusumtai Chaudhari College of Arts.",
};

export default async function StudentCouncilPage() {
  const institutes = await getInstitutesCouncilData();

  return <StudentCouncilClientView institutes={institutes} />;
}
