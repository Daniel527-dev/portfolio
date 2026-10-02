"use client";

import { useEffect } from "react";

// One global pointer listener powers two effects:
//  - a soft glow that follows the cursor across the page (see body::before in layout CSS)
//  - per-card highlights on any element marked with data-spotlight
export default function Spotlight() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    function onMove(e: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;
        root.style.setProperty("--cursor-x", `${e.clientX}px`);
        root.style.setProperty("--cursor-y", `${e.clientY}px`);
        const card = (e.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
          card.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
        }
      });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return null;
}
