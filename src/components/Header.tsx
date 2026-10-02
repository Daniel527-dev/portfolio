import Link from "next/link";
import { site } from "@/site.config";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import styles from "./Header.module.css";

export default function Header() {
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
          <MobileMenu links={site.nav} />
        </div>
      </div>
    </header>
  );
}
