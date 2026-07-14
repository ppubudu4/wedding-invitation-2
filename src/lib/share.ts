import { wedding } from "./wedding";

/**
 * Build a WhatsApp share URL that opens the app/web with a pre-filled message
 * containing a personalized greeting and the invitation link.
 */
export function whatsappShareUrl(link: string, greeting?: string): string {
  const { groom, bride, dateLabel, venue } = wedding;
  const salutation = greeting ? `Dear ${greeting},\n\n` : "";
  const text =
    `${salutation}You are warmly invited to the wedding of ${groom.name} & ${bride.name} 💐\n` +
    `${dateLabel} · ${venue.name}\n\n` +
    `View your invitation & RSVP here:\n${link}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
