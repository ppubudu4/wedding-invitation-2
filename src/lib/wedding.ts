/**
 * Single source of truth for all wedding details.
 * Edit here to update names, date, timeline, and venue across the whole site.
 */

export const wedding = {
  groom: { name: "Pubudu", family: "Perera" },
  bride: { name: "Chaya", family: "Rathnayaka" },

  // Wedding date & time (Sri Lanka time, +05:30). Used by the countdown,
  // the displayed date, and the Add-to-Calendar links.
  dateISO: "2026-09-27T08:45:00+05:30",
  dateEndISO: "2026-09-27T15:51:00+05:30",
  dateLabel: "Sunday, 27 September 2026",
  weekday: "Sunday",
  timeLabel: "8.45 AM",

  tagline: "With every heart guided by love, and every breath full of grace.",

  timeline: [
    {
      time: "8:45 AM",
      event: "Guests Arrive",
      note: "A warm welcome as our families gather to begin the day.",
    },
    {
      time: "9:01 AM",
      event: "Poruwa Ceremony",
      note: "Our traditional Poruwa ritual — the tying of two families into one, blessed by the elders.",
    },
    {
      time: "12:30 PM",
      event: "Lunch Buffet",
      note: "Join us in the Crystal Ballroom for a celebratory feast as we share our first meal as a married couple.",
    },
    {
      time: "3:51 PM",
      event: "Going Away",
      note: "Surrounded by love and warm blessings, we take our leave and step into our new beginning.",
    },
  ],

  venue: {
    name: "Saminro Grand Palace",
    hall: "Crystal Ballroom",
    address: "No. 287, Makola North, Makola, Sri Lanka",
    mapUrl: "https://maps.app.goo.gl/gbQRutryQHci2NpP9",
    // Embeddable map (no API key needed) — search query by name + area.
    mapEmbedUrl:
      "https://www.google.com/maps?q=Saminro+Grand+Palace+Makola+North+Sri+Lanka&output=embed",
  },

  // Gallery — "Stills From The Story".
  // Drop real photos into /public/gallery and set `src` (e.g. "/gallery/1.jpg").
  // Leave `src` empty ("") to show an elegant placeholder frame.
  gallery: [
    { src: "/gallery/1.jpeg", caption: "Where it began" },
    { src: "/gallery/2.jpeg", caption: "Every little moment" },
    { src: "/gallery/3.jpeg", caption: "The proposal" },
    { src: "/gallery/4.jpeg", caption: "Forever, from here" },
  ],
} as const;

export type Wedding = typeof wedding;
