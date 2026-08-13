import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Rsvp, Wish } from "@/components/admin/types";
import SignOutButton from "@/components/admin/SignOutButton";
import ExportCsvButton from "@/components/admin/ExportCsvButton";
import CreateInvite from "@/components/admin/CreateInvite";
import InviteList, { type InviteRowView } from "@/components/admin/InviteList";
import ResponseList, {
  type InvitedSeats,
  type ResponseRowView,
} from "@/components/admin/ResponseList";
import WishModeration from "@/components/admin/WishModeration";
import { inviteGreeting, type Invitation } from "@/lib/invitations";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-braces (middleware also guards this route).
  if (!user) redirect("/admin/login");

  const [{ data: rsvpData, error }, { data: inviteData }, { data: wishData }] =
    await Promise.all([
      supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
      supabase.from("invitations").select("*").order("created_at", { ascending: false }),
      supabase.from("wishes").select("*").order("created_at", { ascending: false }),
    ]);

  const rows = (rsvpData ?? []) as Rsvp[];
  const invites = (inviteData ?? []) as Invitation[];
  const wishes = (wishData ?? []) as Wish[];
  const pendingWishes = wishes.filter((w) => !w.approved).length;

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
      // Couples share a surname-only greeting, so show the admin-only first
      // name to tell same-surname couples apart.
      adminNote: inv.invite_type === "couple" ? inv.first_name : null,
      responded: !!resp,
      attending: resp ? resp.attending : null,
      party: resp ? resp.party_size : null,
      createdBy: inv.created_by_email,
    };
  });

  const inviteById = new Map(invites.map((inv) => [inv.id, inv]));

  const responseRows: ResponseRowView[] = rows.map((r) => {
    const inv = r.invitation_id ? inviteById.get(r.invitation_id) : undefined;
    return {
      id: r.id,
      name: r.name,
      attending: r.attending,
      partySize: r.party_size,
      message: r.message,
      // Formatted here so the client doesn't re-render it in another locale.
      submitted: new Date(r.created_at).toLocaleString(),
      hasInvitation: !!inv,
      createdBy: inv?.created_by_email ?? null,
    };
  });

  const invitedSeats: InvitedSeats[] = invites.map((inv) => ({
    createdBy: inv.created_by_email,
    maxParty: inv.max_party,
  }));

  // invitation_id -> first name, for the CSV export column.
  const firstNames: Record<string, string> = {};
  for (const inv of invites) {
    if (inv.first_name) firstNames[inv.id] = inv.first_name;
  }

  return (
    <main className="admin shell">
      <div className="admin__head">
        <div>
          <p className="eyebrow">Pubudu &amp; Chaya</p>
          <h1 className="admin__title">Admin Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <ExportCsvButton rows={rows} firstNames={firstNames} />
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
        <InviteList items={inviteRows} />
      </section>

      {/* Wishes moderation */}
      <section className="admin__section">
        <div className="admin__head">
          <h2 className="admin__h2">
            Wishes{" "}
            {pendingWishes > 0 && (
              <span className="admin__count admin__count--alert">
                {pendingWishes} pending
              </span>
            )}
          </h2>
        </div>
        <p className="admin__lead">
          Guests leave a wish with their RSVP. Wishes stay hidden until you
          approve them, so nothing unwanted reaches the public wishes wall.
        </p>
        <WishModeration wishes={wishes} />
      </section>

      {/* Responses */}
      <section className="admin__section">
        <ResponseList
          rows={responseRows}
          seats={invitedSeats}
          hasError={!!error}
        />
      </section>
    </main>
  );
}
