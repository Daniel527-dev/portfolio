"use client";

import { useEffect } from "react";

// Fades and slides up anything marked with data-reveal as it scrolls into view.
// Elements that enter together are staggered in document order. The hiding itself
// is CSS gated on html[data-motion], which the head script only sets when the
// visitor hasn't asked for reduced motion, so without JS or motion nothing is hidden.

const MAX_STAGGER = 6;

export default function ScrollReveal() {
  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-motion")) return;

    const io = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-index", String(Math.min(order++, MAX_STAGGER)));
          el.setAttribute("data-revealed", "");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    // Pick up new elements after client-side navigation, at most once per frame.
    let frame = 0;
    const scan = () => {
      frame = 0;
      document
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((el) => io.observe(el));
    };
    scan();
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
