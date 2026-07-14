import { wedding } from "./wedding";

/**
 * Build a WhatsApp share URL that opens the app/web with a pre-filled message
 * containing a personalized greeting and the invitation link.
 */
export function whatsappShareUrl(link: string, greeting?: string): string {
  const { groom, bride } = wedding;
  const salutation = greeting ? `Dear ${greeting},\n\n` : "";
  const text =
    `${salutation}` +
    `With joyful hearts, we invite you to join us as we celebrate our wedding ` +
    `and begin this beautiful new chapter together. Your presence, love, and ` +
    `blessings would mean so much to us. 🥂✨\n\n` +
    `${link}\n\n` +
    `With Love,\n${groom.name} & ${bride.name} ❤️`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
