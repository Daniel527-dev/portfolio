"use client";

import { useEffect, useState } from "react";
import { EyeIcon } from "./icons";

// Registers a view once per browser session, then shows the running total.
export default function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const key = `viewed:${slug}`;
    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(key) === "1";
      sessionStorage.setItem(key, "1");
    } catch {}

    let cancelled = false;
    fetch(`/api/views/${slug}`, { method: alreadyCounted ? "GET" : "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setViews(data.views);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <EyeIcon size={16} />
      {views === null ? "…" : `${views.toLocaleString("en-US")} ${views === 1 ? "view" : "views"}`}
    </span>
  );
}
