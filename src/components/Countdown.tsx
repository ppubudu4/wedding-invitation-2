"use client";

import { Fragment, useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts | null {
  const delta = target - Date.now();
  if (delta <= 0) return null;
  const seconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export default function Countdown() {
  const target = new Date(wedding.dateISO).getTime();
  const [parts, setParts] = useState<Parts | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (mounted && !parts) {
    return (
      <p className="countdown__passed">
        Today is the day — thank you for celebrating with us. ✦
      </p>
    );
  }

  const cells: [string, number | null][] = [
    ["Days", parts?.days ?? null],
    ["Hours", parts?.hours ?? null],
    ["Min", parts?.minutes ?? null],
    ["Sec", parts?.seconds ?? null],
  ];

  return (
    <div
      className="countdown__card"
      role="timer"
      aria-label="Countdown to the wedding day"
    >
      {cells.map(([label, value], i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span className="countdown__sep" aria-hidden="true">
              :
            </span>
          )}
          <div className="countdown__cell">
            <div className="countdown__num">
              {value === null ? "–" : String(value).padStart(2, "0")}
            </div>
            <div className="countdown__label">{label}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
