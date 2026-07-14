import type { Invitation } from "@/lib/invitations";

/**
 * Fetch a single invitation by code via Supabase's REST RPC endpoint using
 * plain `fetch` — no supabase-js dependency. This keeps the edge OG-image
 * function small enough for Vercel's size limit. Uses the security-definer
 * `get_invitation` function, so the anon key is sufficient.
 */
export async function getInvitationByCode(
  code: string
): Promise<Invitation | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url}/rest/v1/rpc/get_invitation`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_code: code }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Invitation) ?? null;
  } catch {
    return null;
  }
}
