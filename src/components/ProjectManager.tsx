"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/db";
import styles from "./ProjectManager.module.css";

type Errors = Partial<Record<"title" | "summary" | "year" | "tags" | "image" | "form", string>>;

// Owner-only UI for the project history: upload new work, feature or delete existing work.
export default function ProjectManager({ projects }: { projects: (Project & { imageUrl: string })[] }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    setErrors({});
    setNotice(null);
    try {
      const res = await fetch("/api/projects", { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Upload failed." });
        return;
      }
      form.reset();
      setPreview(null);
      setNotice("Project added. It's live on the Projects page.");
      router.refresh();
    } catch {
      setErrors({ form: "Couldn't reach the server. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function mutate(id: number, init: RequestInit, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    const res = await fetch(`/api/projects/${id}`, init);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrors({ form: data.error ?? "That didn't work. Please try again." });
      return;
    }
    router.refresh();
  }

  const invalid = (name: keyof Errors) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `project-${name}-error` : undefined,
  });
  const errorFor = (name: keyof Errors) =>
    errors[name] && (
      <p id={`project-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    );

  return (
    <div className={styles.manager}>
      <form className={styles.form} onSubmit={upload} noValidate>
        <h3 className={styles.formTitle}>Add a project</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="project-title">Title</label>
            <input id="project-title" name="title" maxLength={100} required {...invalid("title")} />
            {errorFor("title")}
          </div>
          <div className={styles.field}>
            <label htmlFor="project-year">Year</label>
            <input
              id="project-year"
              name="year"
              type="number"
              min={1990}
              max={new Date().getFullYear() + 1}
              defaultValue={new Date().getFullYear()}
              required
              {...invalid("year")}
            />
            {errorFor("year")}
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="project-summary">Short description</label>
          <textarea id="project-summary" name="summary" rows={3} maxLength={600} required {...invalid("summary")} />
          {errorFor("summary")}
        </div>
        <div className={styles.field}>
          <label htmlFor="project-tags">
            Tags <span className={styles.hint}>(comma separated, e.g. Figma, React, Branding)</span>
          </label>
          <input id="project-tags" name="tags" {...invalid("tags")} />
          {errorFor("tags")}
        </div>
        <div className={styles.field}>
          <label htmlFor="project-image">
            Image <span className={styles.hint}>(PNG, JPEG, WebP, GIF or AVIF, up to 8 MB)</span>
          </label>
          <input
            id="project-image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            {...invalid("image")}
          />
          {errorFor("image")}
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview of the selected image" className={styles.preview} />
          )}
        </div>
        <label className={styles.checkbox}>
          <input type="checkbox" name="featured" /> Show in &ldquo;Selected Projects&rdquo; on the home page
        </label>
        {errors.form && (
          <p className={styles.error} role="alert">
            {errors.form}
          </p>
        )}
        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}
        <button className={styles.submit} disabled={saving}>
          {saving ? "Uploading…" : "Upload project"}
        </button>
      </form>

      {projects.length === 0 ? (
        <p className={styles.empty}>No projects yet. Your uploads will appear here and on the Projects page.</p>
      ) : (
        <ul className={styles.list}>
          {projects.map((p) => (
            <li key={p.id} className={styles.item}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt="" className={styles.thumb} loading="lazy" />
              <div className={styles.itemText}>
                <strong>{p.title}</strong>
                <span className={styles.meta}>
                  {p.year}
                  {p.featured && " · Featured"}
                </span>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.ghost}
                  onClick={() =>
                    mutate(p.id, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ featured: !p.featured }),
                    })
                  }
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  className={`${styles.ghost} ${styles.danger}`}
                  onClick={() => mutate(p.id, { method: "DELETE" }, `Delete “${p.title}”? This also removes its image.`)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
