"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating background-music control.
 * Tries to autoplay on load; browsers block audio autoplay until the user
 * interacts, so if that's rejected we start playback on the very first user
 * gesture (tap / scroll / keypress) — effectively as soon as they engage.
 * Reads /music.mp3 (a swappable placeholder — see public/music.README.txt).
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;

    const gestures: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];
    let done = false;

    const removeGestures = () => {
      gestures.forEach((e) => window.removeEventListener(e, onGesture));
    };

    const start = async () => {
      try {
        await audio.play();
        setPlaying(true);
        done = true;
        removeGestures();
        return true;
      } catch {
        return false;
      }
    };

    const onGesture = () => {
      if (!done) start();
    };

    // 1) Try immediate autoplay.
    start();
    // 2) Fallback: begin on the first user interaction.
    gestures.forEach((e) =>
      window.addEventListener(e, onGesture, { passive: true })
    );

    const onEnded = () => setPlaying(false);
    const onError = () => setAvailable(false);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      removeGestures();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setAvailable(false);
      }
    }
  }

  if (!available) return null;

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      <button
        type="button"
        className="music"
        data-playing={playing}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
      >
        <span className="music__bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="music__label">{playing ? "Pause music" : "Play music"}</span>
      </button>
    </>
  );
}
