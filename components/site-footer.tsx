import { Logo } from "@/components/ui/logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <Logo />
        <span>Secure event registration powered by CIEL.</span>
      </div>
    </footer>
  );
}
