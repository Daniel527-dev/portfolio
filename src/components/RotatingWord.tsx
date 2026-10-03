"use client";

import { useEffect, useState } from "react";
import styles from "./RotatingWord.module.css";

// Cycles through a few words in place. Every word sits in the same grid cell, so
// the width is always the widest word and the headline never reflows. Screen
// readers get the first word only; the rotation is decorative.

const INTERVAL = 2600;

export default function RotatingWord({ words }: { words: string[] }) {
  const [{ index, previous }, setState] = useState({ index: 0, previous: -1 });

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
          </span>
        ))}
      </span>
    </span>
  );
}
