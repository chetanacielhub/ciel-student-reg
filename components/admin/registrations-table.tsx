"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export type AdminRegistrationRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  className: string;
  rollNumber: string;
  role: "team_leader" | "team_member" | "solo";
  teamName: string;
  problemStatement: string;
  createdAt: string;
};

const roleLabels = {
  team_leader: "Team leader",
  team_member: "Team member",
  solo: "Solo",
};

export function RegistrationsTable({ rows }: { rows: AdminRegistrationRow[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | AdminRegistrationRow["role"]>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      const roleMatches = role === "all" || row.role === role;
      const queryMatches =
        !needle ||
        [
          row.fullName,
          row.email,
          row.phone,
          row.institution,
          row.className,
          row.rollNumber,
          row.teamName,
          row.problemStatement,
        ].some((value) => value.toLowerCase().includes(needle));
      return roleMatches && queryMatches;
    });
  }, [query, role, rows]);

  return (
    <div className="table-card">
      <div className="table-card-header">
        <div>
          <h2>All registrations</h2>
          <p>
            Showing {filtered.length.toLocaleString("en-IN")} of {rows.length.toLocaleString("en-IN")} records
          </p>
        </div>
        <div className="table-toolbar">
          <div className="input-wrap admin-search-wrap">
            <Search className="input-icon" size={17} aria-hidden="true" />
            <input
              className="input input-with-icon admin-search"
              type="search"
              placeholder="Search name, team, roll…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search registrations"
            />
          </div>
          <select
            className="select admin-role-filter"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "all" | AdminRegistrationRow["role"])
            }
            aria-label="Filter by registration role"
          >
            <option value="all">All roles</option>
            <option value="team_leader">Team leaders</option>
            <option value="team_member">Team members</option>
            <option value="solo">Solo</option>
          </select>
        </div>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Participant</th>
              <th>Academic</th>
              <th>Roll no.</th>
              <th>Role</th>
              <th>Team / project</th>
              <th>Problem</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <span className="table-primary">{row.fullName}</span>
                  <span className="table-secondary">{row.email}</span>
                  <span className="table-secondary">{row.phone}</span>
                </td>
                <td>
                  <span className="table-primary">{row.institution}</span>
                  <span className="table-secondary">{row.className}</span>
                </td>
                <td>{row.rollNumber}</td>
                <td>
                  <span className="role-label">{roleLabels[row.role]}</span>
                </td>
                <td>{row.teamName}</td>
                <td title={row.problemStatement}>
                  {row.problemStatement.length > 90
                    ? `${row.problemStatement.slice(0, 90)}…`
                    : row.problemStatement}
                </td>
                <td>
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                  }).format(new Date(row.createdAt))}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  No registrations match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
