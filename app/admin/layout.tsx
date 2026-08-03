/**
 * Admin section layout — renders admin pages WITHOUT the public SiteHeader/SiteFooter.
 * This layout sits inside the root layout (html/body/fonts/css) but replaces
 * the header/main/footer shell with a dedicated admin viewport.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
