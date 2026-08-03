import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads & Policy Manuals | CIEL",
  description:
    "Official incubation policies, IPR handbooks, pitch deck templates, and application forms.",
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
