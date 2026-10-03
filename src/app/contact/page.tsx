import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/site.config";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.intro}>
        <p className="eyebrow" data-reveal>Say hello</p>
        <h1 className="page-title" data-reveal>Let&apos;s talk</h1>
        <p className="lede" data-reveal>
          Have a project in mind, a question about an article, or just want to share something cool
          you built? Send me a message and I&apos;ll get back to you.
        </p>
        <p className={styles.alt}>
          Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
      <div className={styles.card}>
        <ContactForm />
      </div>
    </div>
  );
}
