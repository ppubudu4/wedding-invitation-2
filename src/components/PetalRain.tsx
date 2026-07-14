"use client";

import { useEffect, useRef, useState } from "react";
import { Petal } from "./ornaments/Ornaments";

const COUNT = 16;
const COLORS = [
  "var(--color-rose)",
  "var(--color-blush-deep)",
  "var(--color-rose-deep)",
];

type Cfg = { size: number; color: string };
type State = {
  x: number;
  y: number;
  rot: number;
  rotSpeed: number;
  vy: number;
  amp: number;
  freq: number;
  phase: number;
};

/**
 * Rose-petal rain driven by requestAnimationFrame (not CSS animation).
 * rAF keeps running under iOS Low Power Mode / Reduce Motion, where CSS
 * animations are paused — so the petals actually move on phones too.
 */
export default function PetalRain() {
  const [cfgs, setCfgs] = useState<Cfg[] | null>(null);
  const els = useRef<Array<HTMLSpanElement | null>>([]);
  const state = useRef<State[]>([]);

  // Build petals on the client only (avoids SSR/hydration mismatch).
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cfg: Cfg[] = [];
    const st: State[] = [];
    for (let i = 0; i < COUNT; i++) {
      cfg.push({ size: 12 + Math.random() * 12, color: COLORS[i % COLORS.length] });
      st.push({
        x: Math.random() * W,
        y: Math.random() * H, // start scattered so they're visible immediately
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 60 - 30,
        vy: 32 + Math.random() * 46, // px per second
        amp: 20 + Math.random() * 40, // horizontal sway amplitude
        freq: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    state.current = st;
    setCfgs(cfg);
  }, []);

  useEffect(() => {
    if (!cfgs) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const H = window.innerHeight;
      const W = window.innerWidth;

      for (let i = 0; i < state.current.length; i++) {
        const p = state.current[i];
        p.y += p.vy * dt;
        p.rot += p.rotSpeed * dt;
        p.phase += p.freq * dt;
        if (p.y > H + 40) {
          p.y = -40;
          p.x = Math.random() * W;
        }
        const el = els.current[i];
        if (el) {
          const dx = Math.sin(p.phase) * p.amp;
          el.style.transform = `translate3d(${p.x + dx}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cfgs]);

  if (!cfgs) return null;

  return (
    <div className="petal-rain" aria-hidden="true">
      {cfgs.map((c, i) => (
        <span
          key={i}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="petal-js"
          style={{ width: `${c.size}px` }}
        >
          <Petal color={c.color} />
        </span>
      ))}
    </div>
  );
}
