import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Timeline from "@/components/Timeline";
import WishesWall from "@/components/WishesWall";
import Venue from "@/components/Venue";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";
import MusicToggle from "@/components/MusicToggle";
import PetalRain from "@/components/PetalRain";
import Reveal from "@/components/Reveal";
import { FloralDivider } from "@/components/ornaments/Ornaments";
import type { InviteView } from "@/lib/invitations";

/** The full wedding invitation page — generic (/) or personalized (/i/[code]). */
export default function Invitation({ invite }: { invite?: InviteView }) {
  return (
    <>
      <PetalRain />
      <SiteNav />
      <main>
        <Hero greeting={invite?.greeting} />

        {/* Countdown */}
        <section className="section" id="countdown">
          <div className="shell">
            <Reveal className="countdown">
              <p className="eyebrow">Until we begin forever</p>
              <h2 className="section-title">The countdown begins</h2>
              <FloralDivider className="ornament-line" />
              <Countdown />
            </Reveal>
          </div>
        </section>

        <Gallery />

        <Timeline />

        <WishesWall />

        <Venue />

        {/* RSVP */}
        <section className="section" id="rsvp">
          <div className="shell">
            <Reveal className="rsvp__inner">
              <p className="eyebrow">R.S.V.P</p>
              <h2 className="section-title">Will You Stand With Us?</h2>
              <FloralDivider className="ornament-line" />
              <p className="venue__card-sub">
                {invite
                  ? "Kindly let us know if you'll be joining us by 1 September 2026."
                  : "We'd be honoured to have you celebrate with us. Please let us know by 1 September 2026."}
              </p>
              <RsvpForm invite={invite} />
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
      <MusicToggle />
    </>
  );
}
