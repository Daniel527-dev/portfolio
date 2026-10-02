"use client";

import { useEffect, useState } from "react";
import styles from "./Sparkles.module.css";

// Twinkling stars that pop in and out around whatever they wrap.

type Sparkle = { id: number; size: number; color: string; top: string; left: string; born: number };

const COLORS = ["var(--color-tertiary)", "var(--color-secondary)", "var(--color-primary)"];
const LIFETIME = 900;

let nextId = 0;
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function makeSparkle(): Sparkle {
  return {
    id: nextId++,
    size: random(10, 22),
    color: COLORS[random(0, COLORS.length)],
    top: `${random(-15, 85)}%`,
    left: `${random(-5, 100)}%`,
    born: Date.now(),
  };
}

export default function Sparkles({ children }: { children: React.ReactNode }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timeout: number;
    const tick = () => {
      const now = Date.now();
      setSparkles((list) => [...list.filter((s) => now - s.born < LIFETIME), makeSparkle()]);
      timeout = window.setTimeout(tick, random(180, 520));
    };
    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span className={styles.wrapper}>
      {sparkles.map((s) => (
        <span key={s.id} className={styles.sparkle} style={{ top: s.top, left: s.left }} aria-hidden="true">
          <svg width={s.size} height={s.size} viewBox="0 0 68 68" fill={s.color}>
            <path d="M26.5 25.5C19 33.4 0 34 0 34s19.1.6 26.5 8.5C33.9 50.3 34 68 34 68s.2-17.7 7.5-25.5C49.2 34.6 68 34 68 34s-18.8-.6-26.5-8.5C34.3 17.8 34 0 34 0s-.1 17.6-7.5 25.5Z" />
          </svg>
        </span>
      ))}
      <strong className={styles.content}>{children}</strong>
    </span>
  );
}
