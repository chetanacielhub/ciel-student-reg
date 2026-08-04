import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: "small" | "medium" | "large";
};

export function Logo({ className = "", size = "medium" }: LogoProps) {
  const heightMap = {
    small: "100px",
    medium: "140px",
    large: "190px",
  };

  const maxWidthMap = {
    small: "380px",
    medium: "520px",
    large: "700px",
  };

  const marginMap = {
    small: "-15px 0",
    medium: "-30px 0",
    large: "-50px 0",
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
        position: "relative",
        zIndex: 10,
      }}
    >
      <Image
        src="/logo.png"
        alt="CIEL Logo"
        width={520}
        height={140}
        priority
        style={{
          height: heightMap[size],
          width: "auto",
          maxWidth: maxWidthMap[size],
          margin: marginMap[size],
          transform: "translateY(10px)",
          objectFit: "contain",
          borderRadius: 0,
          clipPath: "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      />
    </Link>
  );
}
