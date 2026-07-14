"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Wish = { id: string; name: string; message: string; created_at: string };

/**
 * Display-only wishes carousel. Wishes are collected through the RSVP form
 * (the "wish for the couple" field) and published to the public `wishes` table.
 */
export default function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadError, setLoadError] = useState(false);
  const trackRef = useRef<HTMLUListElement | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wishes")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) {
      setLoadError(true);
      return;
    }
    setWishes((data ?? []) as Wish[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  }

  const hasWishes = !loadError && wishes.length > 0;

  return (
    <section className="section" id="wishes">
      <div className="shell">
        <div className="wishes__head">
          <p className="eyebrow">Wishes</p>
          <h2 className="section-title">Words From Our Loved Ones</h2>
          <p
            className="gallery__note"
            style={{ textAlign: "left", maxWidth: "44ch" }}
          >
            Kind words from the people we love most — left with your RSVP and
            gathered here on our wishes wall.
          </p>
        </div>

        {hasWishes ? (
          <>
            <ul className="wishes__track" ref={trackRef}>
              {wishes.map((w) => (
                <li className="wish" key={w.id}>
                  <p className="wish__msg">“{w.message}”</p>
                  <p className="wish__name">— {w.name}</p>
                </li>
              ))}
            </ul>
            {wishes.length > 1 && (
              <div className="wishes__controls">
                <button
                  type="button"
                  className="carousel-btn"
                  onClick={() => scrollByCards(-1)}
                  aria-label="Previous wishes"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carousel-btn"
                  onClick={() => scrollByCards(1)}
                  aria-label="Next wishes"
                >
                  ›
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="wishes__empty">
            {loadError
              ? "Wishes will appear here once the database is connected."
              : "Be the first to leave a wish — add one with your RSVP below."}
          </p>
        )}
      </div>
    </section>
  );
}
