import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand-lockup" href="/" aria-label="Student Reg home">
      <span className="brand-word">Student Reg</span>
    </Link>
  );
}
