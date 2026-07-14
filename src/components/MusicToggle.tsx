"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating background-music toggle.
 * Audio starts only on user interaction (browsers block autoplay).
 * Reads /music.mp3 (a swappable placeholder — see public/music.README.txt).
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(false);
    const onError = () => setAvailable(false);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
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
      <audio ref={audioRef} src="/music.mp3" loop preload="none" />
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
