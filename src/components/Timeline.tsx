import { wedding } from "@/lib/wedding";
import Reveal from "./Reveal";
import { FloralDivider } from "./ornaments/Ornaments";

/** "Order of Celebrations" — the poruwa-ceremony timeline as cards. */
export default function Timeline() {
  return (
    <section className="section section--cream" id="details">
      <div className="shell">
        <Reveal className="section-head--center">
          <p className="eyebrow">The Day</p>
          <h2 className="section-title">Order of Celebrations</h2>
          <FloralDivider className="ornament-line" />
        </Reveal>

        <ol className="timeline__list">
          {wedding.timeline.map((item, i) => (
            <Reveal
              as="li"
              className="timeline__item"
              key={item.time}
              delay={i * 80}
            >
              <span className="timeline__icon" aria-hidden="true">
                ❋
              </span>
              <div className="timeline__card">
                <div className="timeline__top">
                  <h3 className="timeline__event">{item.event}</h3>
                  <span className="timeline__badge">{item.time}</span>
                </div>
                <p className="timeline__note">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
