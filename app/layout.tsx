import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Event Registration`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Secure team, member, and solo event registration built with Next.js and Supabase.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
