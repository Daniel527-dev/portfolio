"use client";

import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sound";
import styles from "./LikeButton.module.css";

const MAX = 10;
const FLUSH_DELAY = 500;

type Particle = { id: number; angle: number; distance: number; hue: number };

// A heart that fills up a little more with every click, up to 10 likes per
// visitor. Clicks are applied optimistically and batched into one request.
export default function LikeButton({ slug }: { slug: string }) {
  const [total, setTotal] = useState<number | null>(null);
  const [mine, setMine] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const pending = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/likes/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setTotal(data.total);
          setMine(data.mine);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function flush() {
    const amount = pending.current;
    pending.current = 0;
    if (amount === 0) return;
    try {
      const res = await fetch(`/api/likes/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        // Only reconcile if no new clicks arrived while the request was in flight.
        if (pending.current === 0) {
          setTotal(data.total);
          setMine(data.mine);
        }
      }
    } catch {
      // Keep the optimistic value; the next page load shows the real count.
    }
  }

  // Send any batched clicks before the visitor leaves.
  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
      if (pending.current > 0) {
        navigator.sendBeacon?.(
          `/api/likes/${slug}`,
          new Blob([JSON.stringify({ amount: pending.current })], { type: "application/json" }),
        );
      }
    };
  }, [slug]);

  function like() {
    if (mine >= MAX) {
      sounds.click();
      return;
    }
    const next = mine + 1;
    setMine(next);
    setTotal((t) => (t ?? 0) + 1);
    pending.current++;
    sounds.pop(1 + next * 0.08);

    const burst = Array.from({ length: next === MAX ? 14 : 6 }, (_, i) => ({
      id: Date.now() + i,
      angle: (360 / (next === MAX ? 14 : 6)) * i + Math.random() * 20,
      distance: next === MAX ? 56 : 36,
      hue: 330 + Math.random() * 40,
    }));
    setParticles(burst);

    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, FLUSH_DELAY);
  }

  const fill = mine / MAX;
  const maxed = mine >= MAX;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={like}
        data-maxed={maxed}
        aria-label={maxed ? "You liked this the maximum number of times" : `Like this article (${mine} of ${MAX})`}
      >
        <svg className={styles.heart} viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <clipPath id={`heart-fill-${slug}`}>
              <rect x="0" y={24 - 24 * fill} width="24" height={24 * fill} className={styles.fillRect} />
            </clipPath>
          </defs>
          <path
            className={styles.heartOutline}
            d="M12 21s-7.5-4.6-9.6-9.4C1 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3 1.7-1.8 3.1-3 5.3-3 3.7 0 5.7 3.8 4.3 7.1C19.5 16.4 12 21 12 21z"
          />
          <path
            className={styles.heartFill}
            clipPath={`url(#heart-fill-${slug})`}
            d="M12 21s-7.5-4.6-9.6-9.4C1 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3 1.7-1.8 3.1-3 5.3-3 3.7 0 5.7 3.8 4.3 7.1C19.5 16.4 12 21 12 21z"
          />
        </svg>
        {particles.map((p) => (
          <span
            key={p.id}
            className={styles.particle}
            style={
              {
                "--angle": `${p.angle}deg`,
                "--distance": `${p.distance}px`,
                "--hue": p.hue,
              } as React.CSSProperties
            }
            aria-hidden="true"
          />
        ))}
      </button>
      <p className={styles.count} aria-live="polite">
        {total === null ? "…" : total.toLocaleString("en-US")} {total === 1 ? "like" : "likes"}
      </p>
      <p className={styles.hint}>{maxed ? "Thank you so much! 💖" : "Enjoyed it? Tap the heart (up to 10 times!)"}</p>
    </div>
  );
}
