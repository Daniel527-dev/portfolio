"use client";

import { useEffect, useState } from "react";
import styles from "./demos.module.css";

// Mount/unmount a ticking component with and without cleanup and watch how
// many intervals are left running in the background.

const running = new Set<number>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function Ticker({ cleanup }: { cleanup: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setCount((c) => c + 1), 1000);
    running.add(id);
    notify();
    if (!cleanup) return;
    return () => {
      window.clearInterval(id);
      running.delete(id);
      notify();
    };
  }, [cleanup]);
  return <p className={styles.ticker}>⏱ {count}s</p>;
}

export default function CleanupDemo() {
  const [mounted, setMounted] = useState(true);
  const [cleanup, setCleanup] = useState(false);
  const [live, setLive] = useState(0);

  useEffect(() => {
    const sync = () => setLive(running.size);
    listeners.add(sync);
    sync();
    return () => {
      listeners.delete(sync);
    };
  }, []);

  // The demo keeps every interval id so it can stop leaked timers on demand.
  // A real app has no such escape hatch, which is the whole point.
  function reset() {
    running.forEach((id) => window.clearInterval(id));
    running.clear();
    setMounted(false);
    notify();
  }

  return (
    <figure className={styles.demo}>
      <div className={styles.controls}>
        <label className={styles.toggle}>
          <input type="checkbox" checked={cleanup} onChange={(e) => setCleanup(e.target.checked)} />
          Return a cleanup function
        </label>
        <button className={styles.button} onClick={() => setMounted((m) => !m)}>
          {mounted ? "Unmount" : "Mount"} ticker
        </button>
        <button className={styles.ghostButton} onClick={reset}>
          Reset
        </button>
      </div>
      <div className={styles.cleanupStage}>
        {mounted ? <Ticker key={String(cleanup)} cleanup={cleanup} /> : <p className={styles.ticker}>(unmounted)</p>}
        <p className={styles.liveCount} data-warn={live > 1}>
          Intervals running: <strong>{live}</strong>
        </p>
      </div>
      <figcaption className={styles.caption}>
        With cleanup off, toggle the ticker a few times and watch the counter climb. Every extra one
        is a timer nothing can stop.
      </figcaption>
    </figure>
  );
}
