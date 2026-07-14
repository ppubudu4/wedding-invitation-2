"use client";

import { useEffect, useState } from "react";
import { deleteInvitation } from "@/app/actions";
import { whatsappShareUrl } from "@/lib/share";
import WhatsAppIcon from "./WhatsAppIcon";

export type InviteRowView = {
  id: string;
  code: string;
  type: string;
  greeting: string;
  responded: boolean;
  attending: boolean | null;
  party: number | null;
};

function ShareActions({
  code,
  greeting,
}: {
  readonly code: string;
  readonly greeting: string;
}) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);

  const link = origin ? `${origin}/i/${code}` : "";

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="share-cell">
      <button type="button" className="linkbtn" onClick={copy}>
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      {link && (
        <a
          className="linkbtn linkbtn--wa"
          href={whatsappShareUrl(link, greeting)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon /> WhatsApp
        </a>
      )}
    </div>
  );
}

export default function InviteList({ items }: { items: InviteRowView[] }) {
  if (items.length === 0) {
    return <p className="admin__empty">No invitations yet — create one above.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="rsvps">
        <thead>
          <tr>
            <th>Invitation</th>
            <th>Type</th>
            <th>Status</th>
            <th>Guests</th>
            <th>Share</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.greeting}</td>
              <td style={{ textTransform: "capitalize" }}>{it.type}</td>
              <td>
                {it.responded ? (
                  <span className={`pill ${it.attending ? "pill--yes" : "pill--no"}`}>
                    {it.attending ? "Accepted" : "Declined"}
                  </span>
                ) : (
                  <span className="pill pill--wait">Pending</span>
                )}
              </td>
              <td>{it.responded && it.attending ? it.party ?? 1 : "—"}</td>
              <td>
                <ShareActions code={it.code} greeting={it.greeting} />
              </td>
              <td>
                <form action={deleteInvitation.bind(null, it.id)}>
                  <button
                    type="submit"
                    className="linkbtn linkbtn--danger"
                    aria-label={`Delete invitation for ${it.greeting}`}
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
