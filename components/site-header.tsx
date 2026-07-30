import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />

        <nav className="header-nav" aria-label="Primary navigation">
          <Link className="nav-link" href="/#how-it-works">
            How it works
          </Link>
          <Link className="nav-link" href="/register">
            Registration
          </Link>
          {signedIn ? (
            <Link className="nav-link" href="/dashboard">
              My team
            </Link>
          ) : null}
        </nav>

        <div className="header-actions">
          {signedIn ? (
            <>
              <Link className="button button-secondary button-small" href="/dashboard">
                <LayoutDashboard size={16} aria-hidden="true" />
                Dashboard
              </Link>
              <form action="/auth/sign-out" method="post">
                <button className="button button-ghost button-small" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="button button-ghost button-small" href="/auth/sign-in">
                Sign in
              </Link>
              <Link className="button button-primary button-small" href="/auth/sign-up">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
