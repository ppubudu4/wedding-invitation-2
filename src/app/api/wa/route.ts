import { whatsappShareUrl } from "@/lib/share";

// Temporary diagnostic: returns the exact WhatsApp share text the deployed
// build produces, so we can verify emoji encoding on the live site.
export const dynamic = "force-dynamic";

export function GET() {
  const url = whatsappShareUrl(
    "https://cp-invite.love/i/test",
    "Mr & Mrs Silva"
  );
  const text = decodeURIComponent(url.split("text=")[1] ?? "");
  return new Response(`URL:\n${url}\n\nDECODED:\n${text}`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
