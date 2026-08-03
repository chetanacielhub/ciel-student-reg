import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Campus Location | CIEL",
  description:
    "Get in touch with CIEL Incubation Managers, IPR Cell, or visit our Prototyping Labs at Chetana Campus.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
