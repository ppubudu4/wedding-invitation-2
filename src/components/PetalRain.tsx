"use client";

import { useEffect, useState } from "react";
import { Petal } from "./ornaments/Ornaments";

const COUNT = 16;
const COLORS = [
  "var(--color-rose)",
  "var(--color-blush-deep)",
  "var(--color-rose-deep)",
];

/** Deterministic pseudo-random in [0,1) from an index + seed. */
function rnd(i: number, seed: number): number {
  const v = Math.sin((i + 1) * seed) * 10000;
  return v - Math.floor(v);
}

/**
 * A gentle, continuous rain of rose petals across the viewport.
 * Purely decorative (pointer-events: none); hidden under prefers-reduced-motion.
 */
export default function PetalRain() {
  const [mounted, setMounted] = useState(false);

  // Render only after mount so it never blocks first paint or SSR.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="petal-rain" aria-hidden="true">
      {Array.from({ length: COUNT }).map((_, i) => {
        const size = 12 + Math.round(rnd(i, 12.9) * 12); // 12–24px
        const style = {
          ["--x" as string]: `${Math.round(rnd(i, 78.2) * 100)}vw`,
          ["--y" as string]: `${Math.round(rnd(i, 61.3) * 92)}vh`,
          ["--size" as string]: `${size}px`,
          ["--dur" as string]: `${9 + Math.round(rnd(i, 33.1) * 9)}s`,
          ["--delay" as string]: `${-Math.round(rnd(i, 51.4) * 12)}s`,
          ["--drift" as string]: `${Math.round((rnd(i, 5.7) - 0.5) * 160)}px`,
        } as React.CSSProperties;
        return (
          <Petal
            key={i}
            className="petal"
            color={COLORS[i % COLORS.length]}
            style={style}
          />
        );
      })}
    </div>
  );
}
