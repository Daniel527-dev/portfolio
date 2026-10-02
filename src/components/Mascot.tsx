"use client";

import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sound";
import styles from "./Mascot.module.css";

// A hand-drawn SVG avatar. The eyes follow the cursor, it blinks now and then,
// and clicking it makes it wave hello (with a little sound).

const EYES = [
  { cx: 101, cy: 112 },
  { cx: 139, cy: 112 },
];

export default function Mascot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    let frame = 0;
    function onMove(e: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height * 0.45);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 300) * 4;
        setLook({ x: (dx / dist) * reach, y: (dy / dist) * reach });
      });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  function wave() {
    if (waving) return;
    setWaving(true);
    sounds.pop(1.2);
    window.setTimeout(() => setWaving(false), 1200);
  }

  return (
    <button className={styles.button} onClick={wave} aria-label="Say hi to the mascot">
      <svg ref={svgRef} className={styles.svg} viewBox="0 0 240 240" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="mascot-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" />
            <stop offset="1" stopColor="var(--color-secondary)" />
          </linearGradient>
          <clipPath id="mascot-clip">
            <circle cx="120" cy="120" r="112" />
          </clipPath>
        </defs>

        <circle cx="120" cy="120" r="112" fill="url(#mascot-bg)" className={styles.bg} />

        <g clipPath="url(#mascot-clip)">
          {/* shirt + neck */}
          <path d="M42 240c4-46 36-70 78-70s74 24 78 70z" fill="hsl(228deg 30% 18%)" />
          <path d="M104 160h32v20c0 9-32 9-32 0z" fill="hsl(25deg 60% 70%)" />
          <path d="M96 176c8 10 40 10 48 0l8 6c-12 14-52 14-64 0z" fill="var(--color-tertiary)" />

          {/* waving arm */}
          <g className={styles.arm} data-waving={waving}>
            <path d="M188 240c4-30 6-56 14-80" stroke="hsl(228deg 30% 18%)" strokeWidth="26" strokeLinecap="round" fill="none" />
            <circle cx="203" cy="150" r="15" fill="hsl(25deg 60% 72%)" />
          </g>
        </g>

        {/* head */}
        <ellipse cx="120" cy="112" rx="50" ry="54" fill="hsl(25deg 60% 74%)" />
        <ellipse cx="70" cy="116" rx="8" ry="11" fill="hsl(25deg 55% 68%)" />
        <ellipse cx="170" cy="116" rx="8" ry="11" fill="hsl(25deg 55% 68%)" />

        {/* hair */}
        <path
          d="M68 104c-6-40 22-64 56-62 30 2 52 20 50 56-10-16-26-24-44-24 6 6 8 12 6 18-16-14-40-18-68 12z"
          fill="hsl(20deg 45% 22%)"
        />

        {/* eyes */}
        {EYES.map((eye) => (
          <g key={eye.cx}>
            <circle cx={eye.cx} cy={eye.cy} r="10" fill="white" className={styles.eyeWhite} />
            <circle
              cx={eye.cx + look.x}
              cy={eye.cy + look.y}
              r="5"
              fill="hsl(228deg 30% 15%)"
              className={styles.pupil}
            />
          </g>
        ))}

        {/* glasses */}
        <g fill="none" stroke="hsl(228deg 30% 18%)" strokeWidth="3.5">
          <rect x="85" y="98" width="32" height="28" rx="10" />
          <rect x="123" y="98" width="32" height="28" rx="10" />
          <path d="M117 110h6M85 108l-14-4M155 108l14-4" />
        </g>

        {/* cheeks + smile */}
        <ellipse cx="90" cy="138" rx="8" ry="5" fill="var(--color-secondary)" opacity="0.35" />
        <ellipse cx="150" cy="138" rx="8" ry="5" fill="var(--color-secondary)" opacity="0.35" />
        <path
          className={styles.mouth}
          data-waving={waving}
          d="M106 142c6 9 22 9 28 0"
          stroke="hsl(228deg 30% 18%)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
