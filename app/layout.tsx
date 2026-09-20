import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "CIEL — Centre for Innovation & Entrepreneurship Learning",
    template: "%s | CIEL Innovation Hub",
  },
  description:
    "Institutional innovation ecosystem fostering entrepreneurship, incubation, acceleration, social impact, research, and student innovation.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/ciel-favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/ciel-favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="antialiased dark-theme">{children}</body>
    </html>
  );
}
