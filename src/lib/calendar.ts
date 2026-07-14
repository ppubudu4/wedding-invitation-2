import { wedding } from "./wedding";

/** Format an ISO datetime as the UTC basic format Google Calendar expects. */
function toCalUtc(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/** Build a "Add to Google Calendar" URL for the wedding. */
export function googleCalendarUrl(): string {
  const { groom, bride, venue, dateISO, dateEndISO } = wedding;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${groom.name} & ${bride.name} — Wedding`,
    dates: `${toCalUtc(dateISO)}/${toCalUtc(dateEndISO)}`,
    details: `The wedding of ${groom.name} ${groom.family} & ${bride.name} ${bride.family}. ${venue.mapUrl}`,
    location: `${venue.name}, ${venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
