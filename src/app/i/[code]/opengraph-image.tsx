import { renderOgCard, OG_SIZE } from "@/lib/og";
import { anonClient } from "@/lib/supabase/anon";
import { inviteGreeting, type Invitation } from "@/lib/invitations";

export const runtime = "edge";
export const alt = "You're invited — Pubudu & Chaya's Wedding";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { code: string };
}) {
  let greeting: string | undefined;
  try {
    const { data } = await anonClient()
      .rpc("get_invitation", { p_code: params.code })
      .maybeSingle();
    if (data) greeting = inviteGreeting(data as Invitation);
  } catch {
    // Fall back to the generic card if the lookup fails.
  }
  return renderOgCard(greeting);
}
