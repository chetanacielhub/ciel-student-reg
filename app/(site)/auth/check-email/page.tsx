import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Check your email",
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="shell center-page">
      <section className="status-card">
        <div className="status-icon">
          <MailCheck size={30} aria-hidden="true" />
        </div>
        <h1>Confirm your Gmail</h1>
        <p>
          We sent a confirmation link{email ? ` to ${email}` : " to your inbox"}.
          Open it to verify your account, then you will continue to the event
          registration form.
        </p>
        <div className="inline-actions">
          <Link className="button button-primary" href="/auth/sign-in">
            I have confirmed my email
          </Link>
          <Link className="button button-secondary" href="/">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
