import { wedding } from "@/lib/wedding";
import { Hummingbird } from "./ornaments/Ornaments";

/** Ft5 statement footer — deep navy gradient. */
export default function Footer() {
  const { groom, bride, dateLabel, venue } = wedding;

  return (
    <footer className="footer">
      <Hummingbird className="hummingbird hummingbird--b" />
      <div className="shell">
        <p className="footer__names">
          {groom.name} &amp; {bride.name}
        </p>
        <p className="footer__date">
          {dateLabel} · {venue.name}
        </p>
        <p className="footer__sign">
          With love, {groom.name} &amp; {bride.name} ♥
        </p>
        <p className="footer__meta">
          Makola, Sri Lanka · <a href="#rsvp">RSVP</a>
        </p>
      </div>
    </footer>
  );
}
