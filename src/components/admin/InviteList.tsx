"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteInvitation } from "@/app/actions";
import { whatsappShareUrl } from "@/lib/share";
import WhatsAppIcon from "./WhatsAppIcon";

export type InviteRowView = {
  id: string;
  code: string;
  type: string;
  greeting: string;
  adminNote: string | null;
  responded: boolean;
  attending: boolean | null;
  party: number | null;
  createdBy: string | null;
};

const ALL = "all";
/** Filter value for invitations created before creator attribution existed. */
const UNATTRIBUTED = "__none__";

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

export default function InviteList({
  items,
}: {
  readonly items: InviteRowView[];
}) {
  const [creator, setCreator] = useState<string>(ALL);

  const creators = useMemo(() => {
    const emails = new Set<string>();
    let hasUnattributed = false;
    for (const it of items) {
      if (it.createdBy) emails.add(it.createdBy);
      else hasUnattributed = true;
    }
    return { emails: [...emails].sort((a, b) => a.localeCompare(b)), hasUnattributed };
  }, [items]);

  // Deleting a creator's last invitation would otherwise leave the list stuck
  // on an option that no longer exists.
  const isSelectable =
    creator === ALL ||
    (creator === UNATTRIBUTED && creators.hasUnattributed) ||
    creators.emails.includes(creator);
  const selected = isSelectable ? creator : ALL;

  const visible = items.filter((it) => {
    if (selected === ALL) return true;
    if (selected === UNATTRIBUTED) return !it.createdBy;
    return it.createdBy === selected;
  });

  const respondedCount = items.filter((it) => it.responded).length;
  const optionCount = creators.emails.length + (creators.hasUnattributed ? 1 : 0);

  return (
    <>
      <div className="admin__head">
        <h2 className="admin__h2">
          Invitations{" "}
          <span className="admin__count">
            {respondedCount}/{items.length} responded
          </span>
        </h2>
        {optionCount > 1 && (
          <label className="invite-filter">
            <span>Created by</span>
            <select
              value={selected}
              onChange={(e) => setCreator(e.target.value)}
            >
              <option value={ALL}>All</option>
              {creators.emails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
              {creators.hasUnattributed && (
                <option value={UNATTRIBUTED}>Unattributed</option>
              )}
            </select>
          </label>
        )}
      </div>

      {items.length === 0 ? (
        <p className="admin__empty">No invitations yet — create one above.</p>
      ) : visible.length === 0 ? (
        <p className="admin__empty">No invitations match this filter.</p>
      ) : (
        <InviteTable items={visible} />
      )}
    </>
  );
}

function InviteTable({ items }: { readonly items: InviteRowView[] }) {
  return (
    <div className="table-wrap invites-wrap">
      <table className="rsvps invites">
        <thead>
          <tr>
            <th>Invitation</th>
            <th>Type</th>
            <th>Status</th>
            <th>Guests</th>
            <th>Created by</th>
            <th>Share</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td data-label="Invitation">
                {it.greeting}
                {it.adminNote && (
                  <span className="invite-note"> · {it.adminNote}</span>
                )}
              </td>
              <td data-label="Type" style={{ textTransform: "capitalize" }}>
                {it.type}
              </td>
              <td data-label="Status">
                {it.responded ? (
                  <span className={`pill ${it.attending ? "pill--yes" : "pill--no"}`}>
                    {it.attending ? "Accepted" : "Declined"}
                  </span>
                ) : (
                  <span className="pill pill--wait">Pending</span>
                )}
              </td>
              <td data-label="Guests">
                {it.responded && it.attending ? it.party ?? 1 : "—"}
              </td>
              <td data-label="Created by">
                {it.createdBy ? (
                  // The local part is enough to tell two admins apart, and a
                  // full email is too wide for this column.
                  <span title={it.createdBy}>{it.createdBy.split("@")[0]}</span>
                ) : (
                  "—"
                )}
              </td>
              <td data-label="Share">
                <ShareActions code={it.code} greeting={it.greeting} />
              </td>
              <td className="invite-delete-cell">
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
