"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { sounds } from "@/lib/sound";
import styles from "./Header.module.css";

type Theme = "light" | "dark";

// The <html data-theme> attribute is the source of truth (the inline script in
// <head> sets it before paint), so React subscribes to it instead of copying it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);

  // React's dev-mode Strict remount resets <html> attributes; re-apply the saved theme.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark")
        document.documentElement.setAttribute("data-theme", saved);
    } catch {}
  }, []);

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    if (next === "dark") sounds.switchOff();
    else sounds.switchOn();
  }

  const isDark = theme === "dark";

  return (
    <button
      className={styles.iconButton}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <svg
        className={styles.themeIcon}
        data-dark={isDark}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <mask id="moon-mask">
          <rect width="24" height="24" fill="white" />
          <circle className={styles.moonCut} cx="30" cy="5" r="6" fill="black" />
        </mask>
        <circle
          className={styles.sunCore}
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask="url(#moon-mask)"
        />
        <g className={styles.sunRays} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2M12 20.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M1.5 12h2M20.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
