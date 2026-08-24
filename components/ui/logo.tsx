import Link from "next/link";
import Image from "next/image";

const CIEL_LINKEDIN_URL = "https://www.linkedin.com/company/ciel-center-for-innovation-and-entrepreneurship-learning";

type LogoProps = {
  className?: string;
  size?: "small" | "medium" | "large";
  href?: string;
  target?: string;
  rel?: string;
};

export function Logo({
  className = "",
  size = "medium",
  href = CIEL_LINKEDIN_URL,
  target,
  rel,
}: LogoProps) {
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

  const isExternal = href.startsWith("http");
  const linkTarget = target ?? (isExternal ? "_blank" : undefined);
  const linkRel = rel ?? (isExternal ? "noopener noreferrer" : undefined);

  return (
    <Link
      className={`brand-lockup ${className}`}
      href={href}
      target={linkTarget}
      rel={linkRel}
      aria-label="CIEL LinkedIn Page"
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

