import { wedding } from "./wedding";

/**
 * Build a WhatsApp share URL that opens the app/web with a pre-filled message
 * containing a personalized greeting and the invitation link.
 */
export function whatsappShareUrl(link: string, greeting?: string): string {
  const { groom, bride } = wedding;
  const salutation = greeting ? `Dear ${greeting},\n\n` : "";
  // Emojis are written as ASCII \u escapes on purpose: raw emoji bytes can be
  // corrupted (to the replacement char) by editor/git/build encoding steps.
  // \u{...} always resolves to the correct code point.
  const sparkles = "\u{2728}"; // sparkles
  const ring = "\u{1F48D}"; // ring
  const heart = "\u{2764}\u{FE0F}"; // red heart
  const text =
    `${salutation}` +
    `Every love story is beautiful, and ours is about to begin its next ` +
    `chapter. We warmly invite you to celebrate our wedding day and share in ` +
    `the joy, laughter, and love that make this moment so special. ` +
    `${sparkles}${ring}\n\n` +
    `${link}\n\n` +
    `With all our love,\n${groom.name} & ${bride.name} ${heart}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
