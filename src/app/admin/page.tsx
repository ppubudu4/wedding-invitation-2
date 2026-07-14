import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Rsvp } from "@/components/admin/types";
import SignOutButton from "@/components/admin/SignOutButton";
import ExportCsvButton from "@/components/admin/ExportCsvButton";
import CreateInvite from "@/components/admin/CreateInvite";
import InviteList, { type InviteRowView } from "@/components/admin/InviteList";
import { inviteGreeting, type Invitation } from "@/lib/invitations";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-braces (middleware also guards this route).
  if (!user) redirect("/admin/login");

  const [{ data: rsvpData, error }, { data: inviteData }] = await Promise.all([
    supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
    supabase.from("invitations").select("*").order("created_at", { ascending: false }),
  ]);

  const rows = (rsvpData ?? []) as Rsvp[];
  const invites = (inviteData ?? []) as Invitation[];

  const attendingRows = rows.filter((r) => r.attending);
  const decliningCount = rows.length - attendingRows.length;
  const headcount = attendingRows.reduce((sum, r) => sum + (r.party_size || 1), 0);

  // Latest response per invitation, for the invitation status column.
  const responseByInvite = new Map<string, Rsvp>();
  for (const r of rows) {
    if (r.invitation_id && !responseByInvite.has(r.invitation_id)) {
      responseByInvite.set(r.invitation_id, r);
    }
  }

  const inviteRows: InviteRowView[] = invites.map((inv) => {
    const resp = responseByInvite.get(inv.id);
    return {
      id: inv.id,
      code: inv.code,
      type: inv.invite_type,
      greeting: inviteGreeting(inv),
      responded: !!resp,
      attending: resp ? resp.attending : null,
      party: resp ? resp.party_size : null,
    };
  });

  const respondedCount = inviteRows.filter((i) => i.responded).length;

  return (
    <main className="admin shell">
      <div className="admin__head">
        <div>
          <p className="eyebrow">Pubudu &amp; Chaya</p>
          <h1 className="admin__title">Admin Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <ExportCsvButton rows={rows} />
          <SignOutButton />
        </div>
      </div>

      {/* Invitations */}
      <section className="admin__section">
        <h2 className="admin__h2">Invite Guests</h2>
        <p className="admin__lead">
          Create a personalized invitation and share its unique link. Choose
          single, couple, or family — the greeting on the invitation adapts
          automatically.
        </p>
        <CreateInvite />
      </section>

      <section className="admin__section">
        <div className="admin__head">
          <h2 className="admin__h2">
            Invitations{" "}
            <span className="admin__count">
              {respondedCount}/{invites.length} responded
            </span>
          </h2>
        </div>
        <InviteList items={inviteRows} />
      </section>

      {/* Responses */}
      <section className="admin__section">
        <h2 className="admin__h2">All Responses</h2>

        <div className="stats">
          <div className="stat">
            <div className="stat__num">{rows.length}</div>
            <div className="stat__label">Responses</div>
          </div>
          <div className="stat">
            <div className="stat__num">{attendingRows.length}</div>
            <div className="stat__label">Accepting</div>
          </div>
          <div className="stat">
            <div className="stat__num">{decliningCount}</div>
            <div className="stat__label">Declining</div>
          </div>
          <div className="stat">
            <div className="stat__num">{headcount}</div>
            <div className="stat__label">Total guests</div>
          </div>
        </div>

        {error ? (
          <p className="admin__empty">
            Could not load responses. Check that the database schema has been
            applied.
          </p>
        ) : rows.length === 0 ? (
          <p className="admin__empty">No responses yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="rsvps">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Attending</th>
                  <th>Guests</th>
                  <th>Dietary</th>
                  <th>Message</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>
                      <span className={`pill ${r.attending ? "pill--yes" : "pill--no"}`}>
                        {r.attending ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>{r.attending ? r.party_size : "—"}</td>
                    <td>{r.dietary || "—"}</td>
                    <td>{r.message || "—"}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
