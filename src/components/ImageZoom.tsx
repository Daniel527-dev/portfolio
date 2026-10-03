"use client";

import { useRef } from "react";
import styles from "./ImageZoom.module.css";

// A thumbnail that opens the full-size image in a modal dialog (Esc or click to close).
export default function ImageZoom({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={styles.thumbButton}
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`View larger image: ${caption}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.thumb} loading="lazy" decoding="async" />
      </button>
      <dialog ref={dialogRef} className={styles.dialog} onClick={() => dialogRef.current?.close()}>
        <figure className={styles.figure}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.full} />
          <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
      </dialog>
    </>
  );
}
