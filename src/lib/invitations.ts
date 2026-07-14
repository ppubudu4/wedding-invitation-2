export type InviteType = "single" | "couple" | "family";

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
 *  - couple → "Mr & Mrs {Last name}"        e.g. "Mr & Mrs Silva"
 *  - family → "{Mr|Mrs}. {First} {Last} & Family"
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
    case "couple":
      return `Mr & Mrs ${(inv.last_name ?? "").trim()}`.trim();
    case "family": {
      const t = (inv.title ?? "").trim();
      const first = (inv.first_name ?? "").trim();
      const last = (inv.last_name ?? "").trim();
      const name = [t ? `${t}.` : "", first, last].filter(Boolean).join(" ");
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
