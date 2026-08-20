export type InviteType = "single" | "couple" | "family";

/** Titles an admin can tick for a couple or family invitation. */
export const TITLES = ["Mr", "Mrs"] as const;
export type Title = (typeof TITLES)[number];

/** The ticked titles, always in a fixed order: "Mr", "Mrs" or "Mr & Mrs". */
export function joinTitles(titles: readonly string[]): string {
  return TITLES.filter((t) => titles.includes(t)).join(" & ");
}

/** Row shape as stored in Supabase. */
export type Invitation = {
  id: string;
  created_at: string;
  code: string;
  invite_type: InviteType;
  guest_name: string | null;
  title: string | null;
  first_name: string | null;
  last_name: string | null;
  max_party: number;
  // Admin-only: stripped by get_invitation(), so it is always null on the
  // public invitation page.
  created_by_email: string | null;
};

/** View passed to the public invitation page. */
export type InviteView = {
  id: string;
  code: string;
  type: InviteType;
  greeting: string;
  allowCount: boolean;
  defaultCount: number;
  maxParty: number;
};

/**
 * The personalized name shown on the invitation:
 *  - single → the guest's name              e.g. "Nimal Perera"
 *  - couple → "{title} {Last name}"         e.g. "Mr & Mrs Silva", "Mrs Silva"
 *  - family → "{title} {First} {Last} & Family"
 */
export function inviteGreeting(inv: {
  invite_type: InviteType;
  guest_name?: string | null;
  title?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}): string {
  switch (inv.invite_type) {
    case "single":
      return (inv.guest_name ?? "").trim() || "Our Cherished Guest";
    case "couple": {
      // Couples created before titles were selectable have no title stored,
      // so they keep the original "Mr & Mrs" wording.
      const t = (inv.title ?? "").trim() || "Mr & Mrs";
      return `${t} ${(inv.last_name ?? "").trim()}`.trim();
    }
    case "family": {
      const t = (inv.title ?? "").trim();
      const first = (inv.first_name ?? "").trim();
      const last = (inv.last_name ?? "").trim();
      // A lone title takes a full stop ("Mr. Kamal"); a pair reads better
      // without one ("Mr & Mrs Kamal").
      const name = [t.includes("&") ? t : t && `${t}.`, first, last]
        .filter(Boolean)
        .join(" ");
      return `${name} & Family`.trim();
    }
    default:
      return "Our Cherished Guest";
  }
}

/** Build the view object for the public page from a stored row. */
export function toInviteView(inv: Invitation): InviteView {
  const type = inv.invite_type;
  return {
    id: inv.id,
    code: inv.code,
    type,
    greeting: inviteGreeting(inv),
    allowCount: type !== "single",
    defaultCount: type === "couple" ? 2 : 1,
    maxParty: inv.max_party,
  };
}

/** A short, URL-friendly, hard-to-guess code for an invitation link. */
export function generateInviteCode(): string {
  // Web Crypto is available in the Node/edge server-action runtime.
  const uuid = crypto.randomUUID().replace(/-/g, "");
  return uuid.slice(0, 10);
}
