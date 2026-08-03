import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: "small" | "medium" | "large";
};

export function Logo({ className = "", size = "medium" }: LogoProps) {
  const heightMap = {
    small: "48px",
    medium: "64px",
    large: "84px",
  };

  const maxWidthMap = {
    small: "220px",
    medium: "280px",
    large: "360px",
  };

  return (
    <Link
      className={`brand-lockup ${className}`}
      href="/"
      aria-label="CIEL Home"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0",
        margin: "0",
        textDecoration: "none",
      }}
    >
      <Image
        src="/logo.png"
        alt="CIEL Logo"
        width={340}
        height={85}
        priority
        style={{
          height: heightMap[size],
          width: "auto",
          maxWidth: maxWidthMap[size],
          objectFit: "contain",
          borderRadius: 0,
          clipPath: "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      />
    </Link>
  );
}
