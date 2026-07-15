import { wedding } from "@/lib/wedding";
import { GoldenRings, FloralCluster, Hummingbird } from "./ornaments/Ornaments";

/** Marquee hero: the couple's names + date fill the fold. */
export default function Hero({ greeting }: { greeting?: string }) {
  const { groom, bride, weekday, dateLabel, timeLabel, venue, tagline } =
    wedding;

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true" />

      <FloralCluster className="bloom bloom--tl" />
      <FloralCluster className="bloom bloom--tr" />
      <FloralCluster className="bloom bloom--bl" />
      <FloralCluster className="bloom bloom--br" />
      <Hummingbird className="hummingbird hummingbird--a" />

      <div className="hero__content">
        {greeting && <p className="hero__invitee">Dear {greeting},</p>}
        <p className="hero__kicker">The Wedding Of</p>
        <GoldenRings className="hero__rings" />
        <h1 className="hero__names">
          {groom.name}
          <span className="hero__amp">&amp;</span>
          {bride.name}
        </h1>
        <p className="hero__date">
          {weekday} · {dateLabel.replace(`${weekday}, `, "")}
          <small>At {timeLabel}</small>
        </p>
        <p className="hero__venue">{venue.name}</p>
        <p className="hero__tagline">{tagline}</p>
        <a className="btn hero__cta" href="#rsvp">
          RSVP
        </a>
      </div>

      <a className="hero__scroll" href="#countdown">
        Scroll ↓
      </a>
    </section>
  );
}
