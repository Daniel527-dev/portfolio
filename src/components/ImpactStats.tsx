"use client";

import { useEffect, useRef } from "react";
import { motionAllowed } from "@/lib/motion";
import styles from "./ImpactStats.module.css";

// A row of headline numbers that count up once they scroll into view. The server
// renders the final values (that's what screen readers, crawlers and reduced-motion
// visitors get); the count-up writes straight to the DOM, so React never re-renders.

type Stat = { value: number; prefix: string; suffix: string; label: string };

const DURATION = 1600;
const STAGGER = 140;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function ImpactStats({ stats }: { stats: Stat[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !motionAllowed()) return;
    const format = (s: Stat, n: number) => `${s.prefix}${Math.round(n)}${s.suffix}`;
    numberRefs.current.forEach((el, i) => {
      if (el) el.textContent = format(stats[i], 0);
    });

    let frame = 0;
    const run = (start: number) => {
      const now = performance.now();
      let done = true;
      numberRefs.current.forEach((el, i) => {
        const t = Math.min(1, Math.max(0, (now - start - i * STAGGER) / DURATION));
        if (t < 1) done = false;
        if (el) el.textContent = format(stats[i], stats[i].value * easeOut(t));
      });
      if (!done) frame = requestAnimationFrame(() => run(start));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Let the row's reveal slide get going before the numbers start.
        const start = performance.now() + 200;
        frame = requestAnimationFrame(() => run(start));
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(list);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stats]);

  return (
    <ul ref={listRef} className={styles.stats} data-reveal>
      {stats.map((s, i) => (
        <li key={s.label} className={styles.stat}>
          <span
            ref={(el) => {
              numberRefs.current[i] = el;
            }}
            className={styles.number}
          >
            {s.prefix}
            {s.value}
            {s.suffix}
          </span>
          <span className={styles.label}>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
