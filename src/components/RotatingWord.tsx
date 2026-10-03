"use client";

import { useEffect, useId, useState } from "react";
import styles from "./RotatingWord.module.css";

// Cycles through a few words in place. Each new word is "written" in from left to
// right, then a hand-drawn underline strokes in beneath it. Every word sits in the
// same grid cell, so the width is always the widest word and the headline never
// reflows. Screen readers get the first word only; the rotation is decorative.

const INTERVAL = 3200;

export default function RotatingWord({ words }: { words: string[] }) {
  const [{ index, previous }, setState] = useState({ index: 0, previous: -1 });
  // useId output contains characters that don't survive inside url(#...).
  const gradientId = `rw${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-motion") || words.length < 2) return;
    const id = window.setInterval(() => {
      setState((s) => ({ index: (s.index + 1) % words.length, previous: s.index }));
    }, INTERVAL);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className={styles.rotator}>
      <span className="visually-hidden">{words[0]}</span>
      <span className={styles.stack} aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={word}
            className={styles.word}
            data-state={i === index ? "in" : i === previous ? "out" : "idle"}
          >
            {word}
            <svg className={styles.underline} viewBox="0 0 200 14" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`${gradientId}-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="var(--color-primary)" />
                  <stop offset="1" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>
              <path
                d="M3 10.5C38 5.5 92 3.2 140 4.6c22 .6 40 2 57 4.4"
                pathLength={1}
                stroke={`url(#${gradientId}-${i})`}
              />
            </svg>
          </span>
        ))}
      </span>
    </span>
  );
}
