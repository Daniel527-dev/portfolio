"use client";

import { useRef, useState } from "react";
import { ArrowRightIcon } from "./icons";
import styles from "./ProjectGallery.module.css";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  /** "own" for the cover and samples; "reference" for other designers' credited work. */
  kind: "own" | "reference";
  credit?: string;
  sourceUrl?: string;
};

const MAX_THUMBS = 4;

// A project's cover, a strip of its own sample images, and a separate, clearly
// labeled strip of references (other designers' work, credited by name). Any
// image opens a dialog that pages through the whole set (buttons, arrow keys;
// Esc or backdrop closes). Expects own images first, then references.
export default function ProjectGallery({
  title,
  images,
  children,
}: {
  title: string;
  images: GalleryImage[];
  /** The card's text; clicking anywhere on it opens the gallery too. */
  children?: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;
  const ownCount = images.filter((img) => img.kind === "own").length;
  const current = images[index];

  function open(i: number) {
    setIndex(i);
    dialogRef.current?.showModal();
  }
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  const strip = (from: number, to: number, label: string, isRef: boolean) => {
    const list = images.slice(from, to);
    const shown = list.slice(0, MAX_THUMBS);
    const hidden = list.length - shown.length;
    if (shown.length === 0) return null;
    return (
      <div className={isRef ? styles.refs : undefined}>
        {isRef && <p className={styles.stripLabel}>{label}</p>}
        <ul className={styles.strip} aria-label={label}>
          {shown.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className={`${styles.thumb} ${isRef ? styles.refThumb : ""}`}
                onClick={() => open(from + i)}
                aria-label={
                  isRef
                    ? `View reference by ${img.credit}: ${img.caption}`
                    : `View sample ${i + 1}: ${img.caption || img.alt}`
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" loading="lazy" decoding="async" />
                {hidden > 0 && i === shown.length - 1 && <span className={styles.more}>+{hidden}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <button
        type="button"
        className={styles.cover}
        onClick={() => open(0)}
        aria-label={`View images: ${title}${count > 1 ? ` (${count} images)` : ""}`}
      >
        {/* The whole cover is always shown; a blurred copy fills any space around it,
            so covers of any shape fit the 16:10 frame without cropping. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0].src} alt="" aria-hidden="true" className={styles.coverBackdrop} loading="lazy" decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0].src} alt={images[0].alt} className={styles.coverImg} loading="lazy" decoding="async" />
      </button>

      {strip(1, ownCount, "Sample images", false)}
      {strip(ownCount, count, "References", true)}

      {children && (
        // Mouse convenience only: the cover button above is the keyboard and
        // screen-reader way to open the same gallery.
        <div
          className={styles.clickArea}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a, button")) return;
            open(0);
          }}
        >
          {children}
        </div>
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
              {current.kind === "reference" ? (
                <>
                  <span className={styles.refLine}>
                    <strong>{current.caption}</strong>{" "}
                  </span>
                </>
              ) : (
                <>
                  <strong>{title}</strong>
                  {current.caption && <span>{current.caption}</span>}
                </>
              )}
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
