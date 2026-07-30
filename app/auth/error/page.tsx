import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication error",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="shell center-page">
      <section className="status-card">
        <div className="status-icon">
          <CircleAlert size={30} aria-hidden="true" />
        </div>
        <h1>We could not confirm your account</h1>
        <p>
          {message ??
            "The confirmation link may have expired or already been used. Try signing in, or create the account again."}
        </p>
        <div className="inline-actions">
          <Link className="button button-primary" href="/auth/sign-in">
            Try signing in
          </Link>
          <Link className="button button-secondary" href="/auth/sign-up">
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}
