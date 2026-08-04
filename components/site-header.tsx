import { createClient } from "@/lib/supabase/server";
import { SiteHeaderClient } from "@/components/site-header-client";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  return <SiteHeaderClient signedIn={signedIn} />;
}
