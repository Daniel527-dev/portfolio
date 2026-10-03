"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectImage } from "@/lib/db";
import { MAX_CAPTION_LENGTH } from "@/lib/validation";
import styles from "./SampleManager.module.css";

type Sample = ProjectImage & { imageUrl: string };

// Owner-only gallery editor for one project: add, recaption and remove sample images.
export default function SampleManager({ projectId, samples }: { projectId: number; samples: Sample[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const base = `/api/projects/${projectId}/images`;

  async function send(url: string, init: RequestInit) {
    setError(null);
    const res = await fetch(url, init).catch(() => null);
    if (!res) {
      setError("Couldn't reach the server. Please try again.");
      return false;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.errors?.image ?? data.errors?.caption ?? data.error ?? "That didn't work. Please try again.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    if (await send(base, { method: "POST", body: new FormData(form) })) form.reset();
    setSaving(false);
  }

  return (
    <details className={styles.panel}>
      <summary className={styles.summary}>Sample images ({samples.length})</summary>

      {samples.length > 0 && (
        <ul className={styles.samples}>
          {samples.map((s) => (
            <li key={s.id} className={styles.sample}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt="" className={styles.thumb} loading="lazy" />
              <form
                className={styles.captionForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  const caption = new FormData(e.currentTarget).get("caption");
                  send(`${base}/${s.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ caption }),
                  });
                }}
              >
                <label className="visually-hidden" htmlFor={`caption-${s.id}`}>
                  Caption
                </label>
                <input
                  id={`caption-${s.id}`}
                  name="caption"
                  defaultValue={s.caption}
                  maxLength={MAX_CAPTION_LENGTH}
                  placeholder="Caption"
                />
                <button className={styles.ghost}>Save</button>
                <button
                  type="button"
                  className={`${styles.ghost} ${styles.danger}`}
                  onClick={() => {
                    if (window.confirm("Remove this image from the gallery?"))
                      send(`${base}/${s.id}`, { method: "DELETE" });
                  }}
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form className={styles.addForm} onSubmit={upload}>
        <label className="visually-hidden" htmlFor={`sample-image-${projectId}`}>
          Image
        </label>
        <input
          id={`sample-image-${projectId}`}
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          required
        />
        <label className="visually-hidden" htmlFor={`sample-caption-${projectId}`}>
          Caption
        </label>
        <input
          id={`sample-caption-${projectId}`}
          name="caption"
          maxLength={MAX_CAPTION_LENGTH}
          placeholder="Caption (optional)"
        />
        <button className={styles.ghost} disabled={saving}>
          {saving ? "Uploading…" : "Add image"}
        </button>
      </form>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </details>
  );
}
