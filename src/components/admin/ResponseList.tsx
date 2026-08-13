"use client";

import { useMemo, useState } from "react";
import {
  CREATOR_ALL,
  CREATOR_DIRECT,
  CREATOR_UNATTRIBUTED,
  creatorOptions,
  creatorValues,
  matchesCreator,
  resolveCreator,
} from "./creator-filter";

export type ResponseRowView = {
  id: string;
  name: string;
  attending: boolean;
  partySize: number;
  message: string | null;
  /** Preformatted on the server, so client and server markup agree. */
  submitted: string;
  /** Creator of the invitation this response came through, if any. */
  createdBy: string | null;
  hasInvitation: boolean;
};

/** Just enough of each invitation to size the invited headcount per creator. */
export type InvitedSeats = {
  createdBy: string | null;
  maxParty: number;
};

export default function ResponseList({
  rows,
  seats,
  hasError,
}: {
  readonly rows: ResponseRowView[];
  readonly seats: InvitedSeats[];
  readonly hasError: boolean;
}) {
  const [creator, setCreator] = useState<string>(CREATOR_ALL);

  // Creators come from the invitations, not the responses, so an admin whose
  // guests have all stayed silent is still selectable (and shows 0 responses).
  const options = useMemo(
    () => creatorOptions(seats.map((s) => s.createdBy)),
    [seats]
  );
  const hasDirect = rows.some((r) => !r.hasInvitation);
  const values = creatorValues(options, hasDirect ? [CREATOR_DIRECT] : []);
  const selected = resolveCreator(creator, values);

  const visible = rows.filter((r) => {
    if (selected === CREATOR_ALL) return true;
    if (selected === CREATOR_DIRECT) return !r.hasInvitation;
    return r.hasInvitation && matchesCreator(selected, r.createdBy);
  });

  // Direct RSVPs were never invited, so that filter has no seats to count.
  const invited =
    selected === CREATOR_DIRECT
      ? 0
      : seats.reduce(
          (sum, s) =>
            matchesCreator(selected, s.createdBy) ? sum + s.maxParty : sum,
          0
        );

  const attending = visible.filter((r) => r.attending);
  const declining = visible.length - attending.length;
  const headcount = attending.reduce((sum, r) => sum + (r.partySize || 1), 0);

  return (
    <>
      <div className="admin__head">
        <h2 className="admin__h2">All Responses</h2>
        {values.length > 1 && (
          <label className="admin-filter">
            <span>Created by</span>
            <select
              value={selected}
              onChange={(e) => setCreator(e.target.value)}
            >
              <option value={CREATOR_ALL}>All</option>
              {options.emails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
              {options.hasUnattributed && (
                <option value={CREATOR_UNATTRIBUTED}>
                  Unattributed invitation
                </option>
              )}
              {hasDirect && (
                <option value={CREATOR_DIRECT}>Direct RSVP (no invitation)</option>
              )}
            </select>
          </label>
        )}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat__num">{invited}</div>
          <div className="stat__label">Invited</div>
        </div>
        <div className="stat">
          <div className="stat__num">{visible.length}</div>
          <div className="stat__label">Responses</div>
        </div>
        <div className="stat">
          <div className="stat__num">{attending.length}</div>
          <div className="stat__label">Accepting</div>
        </div>
        <div className="stat">
          <div className="stat__num">{declining}</div>
          <div className="stat__label">Declining</div>
        </div>
        <div className="stat">
          <div className="stat__num">{headcount}</div>
          <div className="stat__label">Total guests</div>
        </div>
      </div>

      {hasError ? (
        <p className="admin__empty">
          Could not load responses. Check that the database schema has been
          applied.
        </p>
      ) : rows.length === 0 ? (
        <p className="admin__empty">No responses yet.</p>
      ) : visible.length === 0 ? (
        <p className="admin__empty">No responses match this filter.</p>
      ) : (
        <div className="table-wrap">
          <table className="rsvps">
            <thead>
              <tr>
                <th>Name</th>
                <th>Attending</th>
                <th>Guests</th>
                <th>Message</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>
                    <span className={`pill ${r.attending ? "pill--yes" : "pill--no"}`}>
                      {r.attending ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{r.attending ? r.partySize : "—"}</td>
                  <td>{r.message || "—"}</td>
                  <td>{r.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
