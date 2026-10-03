import Link from "next/link";
import { getPostMetas } from "@/lib/content";
import { categoryLabel, site } from "@/site.config";
import { RssIcon } from "./icons";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import Search from "./Search";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default function Header() {
  const searchItems = getPostMetas().map((p) => ({
    title: p.title,
    abstract: p.abstract,
    href: `/blog/${p.slug}`,
    category: categoryLabel(p.category),
  }));

  // The wordmark uses the first and last name, so longer names stay compact.
  const words = site.name.split(" ");
  const first = words[0];
  const last = words.length > 1 ? words[words.length - 1] : "";

  return (
    <header className={styles.header}>
      <div className={`wrapper ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${site.name}, home`}>
          <span className={styles.logoMark} aria-hidden="true">
            {first[0]}
            {last[0]}
          </span>
          <span className={styles.logoText}>
            {first}
            <span className={styles.logoAccent}>{last}</span>
          </span>
        </Link>

        <NavLinks links={site.nav} />

        <div className={styles.actions}>
          <Search items={searchItems} />
          <a className={`${styles.iconButton} ${styles.desktopOnly}`} href="/rss.xml" aria-label="RSS feed" title="RSS feed">
            <RssIcon />
          </a>
          <SoundToggle />
          <ThemeToggle />
          <MobileMenu links={site.nav} />
        </div>
      </div>
    </header>
  );
}
