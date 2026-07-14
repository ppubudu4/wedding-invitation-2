import { renderOgCard, OG_SIZE } from "@/lib/og";
import { getInvitationByCode } from "@/lib/supabase/rest";
import { inviteGreeting } from "@/lib/invitations";

export const runtime = "edge";
export const alt = "You're invited — Pubudu & Chaya's Wedding";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { code: string };
}) {
  const invitation = await getInvitationByCode(params.code);
  const greeting = invitation ? inviteGreeting(invitation) : undefined;
  return renderOgCard(greeting);
}
