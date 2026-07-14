import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { anonClient } from "@/lib/supabase/anon";
import Invitation from "@/components/Invitation";
import {
  inviteGreeting,
  toInviteView,
  type Invitation as InviteRow,
} from "@/lib/invitations";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const { code } = params;
  let greeting: string | undefined;
  try {
    const { data } = await anonClient()
      .rpc("get_invitation", { p_code: code })
      .maybeSingle();
    if (data) greeting = inviteGreeting(data as InviteRow);
  } catch {
    // fall back to defaults below
  }

  const title = greeting
    ? `${greeting}, you're invited — Pubudu & Chaya`
    : "You're invited — Pubudu & Chaya";
  const description =
    "Join us on Sunday, 27 September 2026 at Saminro Grand Palace, Makola. Tap to view the invitation and RSVP.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "Pubudu & Chaya" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PersonalizedInvite({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;
  const supabase = await createClient();

  const { data } = await supabase
    .rpc("get_invitation", { p_code: code })
    .maybeSingle();

  const row = data as InviteRow | null;
  const invite = row ? toInviteView(row) : undefined;

  // A missing/expired code still shows the beautiful generic invitation.
  return <Invitation invite={invite} />;
}
