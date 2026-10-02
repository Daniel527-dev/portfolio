import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={`wrapper ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        4<span className={styles.spin}>🍩</span>4
      </p>
      <h1 className="page-title">This page wandered off</h1>
      <p className="lede">
        The link might be old, or I may have moved things around. Let&apos;s get you somewhere
        useful.
      </p>
      <div className={styles.links}>
        <Link href="/">Go home</Link>
        <Link href="/blog">Browse articles</Link>
      </div>
    </div>
  );
}
