import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
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
    <html lang="en" className={`${plusJakartaSans.variable} ${playfair.variable}`}>
      <body className="antialiased dark-theme">{children}</body>
    </html>
  );
}
