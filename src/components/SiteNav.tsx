/** Centered floating pill nav (N5) with in-page anchor links. */
export default function SiteNav() {
  const links = [
    ["#top", "Home"],
    ["#gallery", "Gallery"],
    ["#details", "Events"],
    ["#wishes", "Wishes"],
    ["#venue", "Venue"],
    ["#rsvp", "RSVP"],
  ] as const;

  return (
    <nav className="nav" aria-label="Sections">
      <ul className="nav__pill">
        {links.map(([href, label]) => (
          <li key={href}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
