import { EVENT_SLUG } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { EventRecord } from "@/lib/types";
import { HomeView } from "@/components/home/home-view";
import { getElevatorPitches } from "@/lib/dynamic-store";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id,slug,title,description,venue,registration_open")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  const event = data as EventRecord | null;
  const pitches = await getElevatorPitches();

  return <HomeView event={event} pitches={pitches} />;
}
