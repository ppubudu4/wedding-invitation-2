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
  const glasses = "\u{1F942}"; // champagne glasses
  const sparkles = "\u{2728}"; // sparkles
  const heart = "\u{2764}\u{FE0F}"; // red heart
  const text =
    `${salutation}` +
    `With joyful hearts, we invite you to join us as we celebrate our wedding ` +
    `and begin this beautiful new chapter together. Your presence, love, and ` +
    `blessings would mean so much to us. ${glasses}${sparkles}\n\n` +
    `${link}\n\n` +
    `With Love,\n${groom.name} & ${bride.name} ${heart}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
