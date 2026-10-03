"use client";

import { useRef, useState } from "react";
import { ArrowRightIcon } from "./icons";
import styles from "./ProjectGallery.module.css";

export type GalleryImage = { src: string; alt: string; caption: string };

const MAX_THUMBS = 4;

// A project's cover plus a strip of sample thumbnails. Any image opens a dialog
// that pages through the whole set (buttons, arrow keys; Esc or backdrop closes).
export default function ProjectGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;
  const samples = images.slice(1);
  const shown = samples.slice(0, MAX_THUMBS);
  const hidden = samples.length - shown.length;
  const current = images[index];

  function open(i: number) {
    setIndex(i);
    dialogRef.current?.showModal();
  }
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <>
      <button
        type="button"
        className={styles.cover}
        onClick={() => open(0)}
        aria-label={`View images: ${title}${count > 1 ? ` (${count} images)` : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0].src} alt={images[0].alt} className={styles.coverImg} loading="lazy" decoding="async" />
        {count > 1 && <span className={styles.count}>{count} images</span>}
      </button>

      {shown.length > 0 && (
        <ul className={styles.strip} aria-label="Sample images">
          {shown.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className={styles.thumb}
                onClick={() => open(i + 1)}
                aria-label={`View sample ${i + 1}: ${img.caption || img.alt}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" loading="lazy" decoding="async" />
                {hidden > 0 && i === shown.length - 1 && <span className={styles.more}>+{hidden}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={`${title} images`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (count < 2) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        <figure className={styles.figure}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={current.src} src={current.src} alt={current.alt} className={styles.full} />
          <figcaption className={styles.caption}>
            <span className={styles.captionText}>
              <strong>{title}</strong>
              {current.caption && <span>{current.caption}</span>}
            </span>
            <span className={styles.controls}>
              {count > 1 && (
                <span className={styles.position}>
                  {index + 1} / {count}
                </span>
              )}
              <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} aria-label="Close">
                ×
              </button>
            </span>
          </figcaption>
          {count > 1 && (
            <>
              <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Previous image">
                <ArrowRightIcon size={20} />
              </button>
              <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label="Next image">
                <ArrowRightIcon size={20} />
              </button>
            </>
          )}
        </figure>
      </dialog>
    </>
  );
}
