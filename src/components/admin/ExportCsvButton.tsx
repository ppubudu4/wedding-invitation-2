"use client";

import type { Rsvp } from "@/components/admin/types";

function toCsv(rows: Rsvp[], firstNames: Record<string, string>): string {
  const headers = [
    "Name",
    "First name",
    "Attending",
    "Party size",
    "Message",
    "Submitted",
  ];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const lines = rows.map((r) => {
    const firstName = r.invitation_id ? firstNames[r.invitation_id] ?? "" : "";
    return [
      r.name,
      firstName,
      r.attending ? "Yes" : "No",
      r.attending ? r.party_size : "",
      r.message ?? "",
      new Date(r.created_at).toLocaleString(),
    ]
      .map(escape)
      .join(",");
  });
  return [headers.join(","), ...lines].join("\n");
}

export default function ExportCsvButton({
  rows,
  firstNames = {},
}: {
  readonly rows: Rsvp[];
  readonly firstNames?: Record<string, string>;
}) {
  function download() {
    const blob = new Blob([toCsv(rows, firstNames)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvps.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={download}
      disabled={rows.length === 0}
      aria-disabled={rows.length === 0}
    >
      Export CSV
    </button>
  );
}
