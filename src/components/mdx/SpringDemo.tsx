"use client";

import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sound";
import styles from "./demos.module.css";

// A real spring simulation (semi-implicit Euler) so readers can feel how
// stiffness and damping change the motion.
export default function SpringDemo() {
  const [stiffness, setStiffness] = useState(170);
  const [damping, setDamping] = useState(12);
  const [target, setTarget] = useState(0);
  const ballRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, v: 0 });

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const s = state.current;
      const force = -stiffness * (s.x - target) - damping * s.v;
      s.v += force * dt;
      s.x += s.v * dt;
      const track = trackRef.current;
      const ball = ballRef.current;
      if (track && ball) {
        const travel = track.clientWidth - ball.clientWidth;
        ball.style.transform = `translateX(${s.x * travel}px)`;
      }
      if (Math.abs(s.v) > 0.0005 || Math.abs(s.x - target) > 0.0005) {
        frame = requestAnimationFrame(step);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, stiffness, damping]);

  const feel = damping < 8 ? "Bouncy" : damping < 20 ? "Snappy" : damping < 35 ? "Smooth" : "Sluggish";

  return (
    <figure className={styles.demo}>
      <div className={styles.stage}>
        <div ref={trackRef} className={styles.track}>
          <div ref={ballRef} className={styles.ball} />
        </div>
      </div>
      <div className={styles.controls}>
        <label className={styles.slider}>
          <span>
            Stiffness <output>{stiffness}</output>
          </span>
          <input type="range" min={20} max={400} value={stiffness} onChange={(e) => setStiffness(+e.target.value)} />
        </label>
        <label className={styles.slider}>
          <span>
            Damping <output>{damping}</output>
          </span>
          <input type="range" min={1} max={60} value={damping} onChange={(e) => setDamping(+e.target.value)} />
        </label>
        <button
          className={styles.button}
          onClick={() => {
            setTarget((t) => (t === 0 ? 1 : 0));
            sounds.pop(target === 0 ? 1.3 : 1);
          }}
        >
          Move it! <span className={styles.badge}>{feel}</span>
        </button>
      </div>
      <figcaption className={styles.caption}>
        Drag the sliders, then press the button. Low damping wobbles; high stiffness is quick.
      </figcaption>
    </figure>
  );
}
