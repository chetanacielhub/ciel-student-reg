import { requireAdmin } from "@/lib/auth";
import { EVENT_SLUG } from "@/lib/config";

type RawRegistration = {
  role: "team_leader" | "team_member" | "solo";
  roll_number: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string | null;
    phone: string | null;
  } | null;
  institutions: { name: string } | null;
  classes: { name: string } | null;
  teams: { name: string; problem_statement: string } | null;
};

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  // Prevent spreadsheet applications from evaluating user-controlled formulas.
  const safeText = /^[=+\-@\t]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

export async function GET() {
  const { supabase } = await requireAdmin();
  const { data: event } = await supabase
    .from("events")
    .select("id,slug")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  const { data } = event
    ? await supabase
        .from("event_registrations")
        .select(
          `
            role,
            roll_number,
            created_at,
            profiles:user_id(full_name,email,phone),
            institutions:institution_id(name),
            classes:class_id(name),
            teams:team_id(name,problem_statement)
          `,
        )
        .eq("event_id", event.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  const rows = (data ?? []) as unknown as RawRegistration[];
  const header = [
    "Full name",
    "Email",
    "Phone",
    "Institution",
    "Class",
    "Roll number",
    "Role",
    "Team or project",
    "Problem statement",
    "Registered at",
  ];

  const body = rows.map((row) =>
    [
      row.profiles?.full_name,
      row.profiles?.email,
      row.profiles?.phone,
      row.institutions?.name,
      row.classes?.name,
      row.roll_number,
      row.role,
      row.teams?.name,
      row.teams?.problem_statement,
      row.created_at,
    ]
      .map(csvCell)
      .join(","),
  );

  const csv = `\uFEFF${header.map(csvCell).join(",")}\n${body.join("\n")}`;
  const fileSlug = (event?.slug ?? "event").replace(/[^a-z0-9_-]+/gi, "-");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileSlug}-registrations.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
