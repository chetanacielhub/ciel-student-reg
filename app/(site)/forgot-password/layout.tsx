import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | CIEL User Portal",
  description: "Request a password reset link for your CIEL innovator account.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
