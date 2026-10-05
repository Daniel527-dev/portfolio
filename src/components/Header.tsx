import Link from "next/link";
import { getPostMetas } from "@/lib/content";
import { categoryLabel, site } from "@/site.config";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import Search from "./Search";
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
  const wordmark = words.length > 1 ? `${words[0]} ${words[words.length - 1]}` : words[0];

  return (
    <header className={styles.header}>
      <div className={`wrapper ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${site.name}, home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/monogram.png" alt="" className={styles.logoMark} width={166} height={102} />
          <span className={styles.logoText}>
            <span className={styles.logoName}>{wordmark}</span>
            <span className={styles.logoRole}>UI Designer</span>
          </span>
        </Link>

        <NavLinks links={site.nav} />

        <div className={styles.actions}>
          <Search items={searchItems} />
          <ThemeToggle />
          <MobileMenu links={site.nav} />
        </div>
      </div>
    </header>
  );
}
