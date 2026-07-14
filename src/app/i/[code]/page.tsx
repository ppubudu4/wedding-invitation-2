import type { Metadata } from "next";
import Invitation from "@/components/Invitation";
import { getInvitationByCode } from "@/lib/supabase/rest";
import { inviteGreeting, toInviteView } from "@/lib/invitations";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const invitation = await getInvitationByCode(params.code);
  const greeting = invitation ? inviteGreeting(invitation) : undefined;

  const title = "Pubudu & Chaya — Wedding Invitation";
  const description = greeting
    ? `Dear ${greeting}, you're warmly invited to celebrate the wedding of Pubudu & Chaya on Sunday, 27 September 2026 at Saminro Grand Palace. Kindly RSVP.`
    : "You're warmly invited to celebrate the wedding of Pubudu & Chaya on Sunday, 27 September 2026 at Saminro Grand Palace. Kindly RSVP.";

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
  const invitation = await getInvitationByCode(params.code);
  const invite = invitation ? toInviteView(invitation) : undefined;

  // A missing/expired code still shows the beautiful generic invitation.
  return <Invitation invite={invite} />;
}
