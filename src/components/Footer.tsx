import Link from "next/link";
import { categories, site } from "@/site.config";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <svg
        className={styles.wave}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v40H0z" />
      </svg>
      <div className={styles.body}>
        <div className={`wrapper ${styles.grid}`}>
          <div className={styles.about}>
            <p className={styles.name}>{site.name}</p>
            <p className={styles.blurb}>{site.tagline}</p>
            <ul className={styles.socials}>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Site">
            <h2 className={styles.heading}>Explore</h2>
            <ul className={styles.links}>
              <li>
                <Link href="/blog">All articles</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/about">About me</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <a href="/rss.xml">RSS feed</a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Categories">
            <h2 className={styles.heading}>Categories</h2>
            <ul className={styles.links}>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={`wrapper ${styles.legal}`}>
          <p>
            © {new Date().getFullYear()} {site.name}. Built with Next.js, MDX and SQLite.
          </p>
          <p>
            Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search
          </p>
        </div>
      </div>
    </footer>
  );
}
