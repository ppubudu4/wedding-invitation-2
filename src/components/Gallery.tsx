import { wedding } from "@/lib/wedding";
import Reveal from "./Reveal";

/** "Stills From The Story" — a polaroid-style photo gallery. */
export default function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="shell">
        <Reveal className="gallery__head">
          <div>
            <p className="eyebrow">Captured</p>
            <h2 className="section-title">Stills From The Story</h2>
          </div>
          <p className="gallery__note">
            A slow scroll through the small moments that brought us here.
          </p>
        </Reveal>

        <div className="gallery__grid">
          {wedding.gallery.map((photo, i) => (
            <Reveal
              className={`frame frame--${i % 2 === 0 ? "tilt-l" : "tilt-r"}`}
              key={photo.caption}
              delay={i * 70}
            >
              <div className="frame__photo">
                {photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt={photo.caption} loading="lazy" />
                ) : (
                  <span className="frame__placeholder" aria-hidden="true">
                    ✦
                  </span>
                )}
              </div>
              <p className="frame__caption">{photo.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
