"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectImage } from "@/lib/db";
import { MAX_CAPTION_LENGTH } from "@/lib/validation";
import styles from "./SampleManager.module.css";

type Sample = ProjectImage & { imageUrl: string };

// Owner-only gallery editor for one project: add, edit and remove images. Each image
// is either the owner's own work or a reference to someone else's, which must be
// credited and linked to its original.
export default function SampleManager({ projectId, samples }: { projectId: number; samples: Sample[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [kind, setKind] = useState<"sample" | "reference">("sample");
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
      const errors = data.errors ?? {};
      setError(errors.image ?? errors.caption ?? errors.credit ?? errors.sourceUrl ?? data.error ?? "That didn't work. Please try again.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    if (await send(base, { method: "POST", body: new FormData(form) })) {
      form.reset();
      setKind("sample");
    }
    setSaving(false);
  }

  const references = samples.filter((s) => s.kind === "reference").length;

  return (
    <details className={styles.panel}>
      <summary className={styles.summary}>
        Gallery ({samples.length - references} own{references > 0 ? `, ${references} references` : ""})
      </summary>

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
                  const data = Object.fromEntries(new FormData(e.currentTarget));
                  send(`${base}/${s.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                }}
              >
                {s.kind === "reference" && <span className={styles.refTag}>Reference</span>}
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
                {s.kind === "reference" && (
                  <>
                    <label className="visually-hidden" htmlFor={`credit-${s.id}`}>
                      Made by
                    </label>
                    <input id={`credit-${s.id}`} name="credit" defaultValue={s.credit} maxLength={80} placeholder="Made by" />
                    <label className="visually-hidden" htmlFor={`source-${s.id}`}>
                      Link to the original
                    </label>
                    <input
                      id={`source-${s.id}`}
                      name="sourceUrl"
                      type="url"
                      defaultValue={s.sourceUrl}
                      placeholder="https://… link to the original"
                    />
                  </>
                )}
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
        <fieldset className={styles.kind}>
          <legend className="visually-hidden">Whose work is this?</legend>
          <label>
            <input type="radio" name="kind" value="sample" checked={kind === "sample"} onChange={() => setKind("sample")} />{" "}
            My own work
          </label>
          <label>
            <input
              type="radio"
              name="kind"
              value="reference"
              checked={kind === "reference"}
              onChange={() => setKind("reference")}
            />{" "}
            Reference (someone else&apos;s work)
          </label>
        </fieldset>
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
        {kind === "reference" && (
          <>
            <label className="visually-hidden" htmlFor={`sample-credit-${projectId}`}>
              Made by
            </label>
            <input id={`sample-credit-${projectId}`} name="credit" maxLength={80} placeholder="Made by (required)" required />
            <label className="visually-hidden" htmlFor={`sample-source-${projectId}`}>
              Link to the original
            </label>
            <input
              id={`sample-source-${projectId}`}
              name="sourceUrl"
              type="url"
              placeholder="https://… link to the original (required)"
              required
            />
          </>
        )}
        <button className={styles.ghost} disabled={saving}>
          {saving ? "Uploading…" : "Add image"}
        </button>
      </form>
      {kind === "reference" && (
        <p className={styles.hint}>
          References are shown labeled &ldquo;Reference&rdquo; with the creator&apos;s name. Only add work
          you have permission to show.
        </p>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </details>
  );
}
