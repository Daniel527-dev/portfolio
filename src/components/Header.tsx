import Link from "next/link";
import { getPostMetas } from "@/lib/content";
import { categoryLabel, site } from "@/site.config";
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

  return (
    <header className={styles.header}>
      <div className={`wrapper ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${site.name}, home`}>
          <span className={styles.logoMark} aria-hidden="true">
            {site.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <span className={styles.logoText}>
            {site.name.split(" ")[0]}
            <span className={styles.logoAccent}>{site.name.split(" ").slice(1).join("")}</span>
          </span>
        </Link>

        <NavLinks links={site.nav} />

        <div className={styles.actions}>
          <Search items={searchItems} />
          <SoundToggle />
          <ThemeToggle />
          <MobileMenu links={site.nav} />
        </div>
      </div>
    </header>
  );
}
