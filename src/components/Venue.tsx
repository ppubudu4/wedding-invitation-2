import { wedding } from "@/lib/wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import Reveal from "./Reveal";

/** Venue section — heading, embedded map, and a date card with add-to-calendar. */
export default function Venue() {
  const { venue, weekday, dateLabel, timeLabel } = wedding;
  const calendarUrl = googleCalendarUrl();
  const dateOnly = dateLabel.replace(`${weekday}, `, "");

  return (
    <section className="section section--cream" id="venue">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">The Setting</p>
          <h2 className="section-title">{venue.name}</h2>
          <p className="venue__card-sub" style={{ marginTop: "var(--space-xs)" }}>
            {venue.address}
          </p>
        </Reveal>

        <Reveal className="venue__grid">
          <div className="venue__map">
            <iframe
              title={`Map to ${venue.name}`}
              src={venue.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="venue__card">
            <div>
              <p className="venue__card-label">The Date</p>
              <p className="venue__card-date">{dateOnly}</p>
              <p className="venue__card-sub">
                {weekday} · {timeLabel}
              </p>
            </div>
            <div>
              <p className="venue__card-label">Reception</p>
              <p className="venue__card-addr">{venue.hall}</p>
              <p className="venue__card-sub">{venue.address}</p>
            </div>
            <a
              className="btn"
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Calendar
            </a>
            <a className="btn btn--ghost" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
