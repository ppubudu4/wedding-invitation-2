import { createClient } from "@supabase/supabase-js";

/**
 * A cookie-less Supabase client (anon key) for contexts without a request
 * session — e.g. Open Graph image generation. Only used for public reads
 * such as the `get_invitation` RPC.
 */
export function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
