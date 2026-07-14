"use client";

import type { Rsvp } from "@/components/admin/types";

function toCsv(rows: Rsvp[]): string {
  const headers = [
    "Name",
    "Attending",
    "Party size",
    "Dietary",
    "Message",
    "Submitted",
  ];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    [
      r.name,
      r.attending ? "Yes" : "No",
      r.attending ? r.party_size : "",
      r.dietary ?? "",
      r.message ?? "",
      new Date(r.created_at).toLocaleString(),
    ]
      .map(escape)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function ExportCsvButton({ rows }: { rows: Rsvp[] }) {
  function download() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
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
