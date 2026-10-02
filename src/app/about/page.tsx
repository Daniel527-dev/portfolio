import type { Metadata } from "next";
import Link from "next/link";
import Mascot from "@/components/Mascot";
import { experience, site } from "@/site.config";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `Who ${site.name} is, what they work on and how to get in touch.`,
};

const toolbox = [
  { group: "Front end", items: ["TypeScript", "React", "Next.js", "CSS / Sass", "Framer Motion", "Three.js"] },
  { group: "Back end", items: ["Node.js", "NestJS", "PostgreSQL", "SQLite", "Redis", "REST & GraphQL"] },
  { group: "Tooling", items: ["Vite", "Vitest", "Playwright", "Docker", "GitHub Actions", "Figma"] },
];

export default function AboutPage() {
  return (
    <div className={`wrapper ${styles.page}`}>
      <aside className={styles.side}>
        <div className={styles.mascot}>
          <Mascot />
        </div>
        <h1 className={styles.name}>{site.name}</h1>
        <p className={styles.role}>{site.role}</p>
        <p className={styles.tagline}>{site.tagline}</p>
        <ul className={styles.facts}>
          <li>📍 {site.location}</li>
          <li>
            ✉️ <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
        </ul>
        <ul className={styles.socials}>
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.main}>
        <section aria-labelledby="about-heading" className={styles.section}>
          <h2 id="about-heading" className={styles.sectionTitle}>
            About
          </h2>
          <div className={styles.bio}>
            <p>
              I fell into web development through a school project: a fan site that needed a
              guestbook. Getting a form to actually save something to a database felt like magic,
              and honestly it still does.
            </p>
            <p>
              These days I work across the whole stack. I like owning a feature end to end, from the
              database schema and API all the way to the hover state on the button. My favourite
              problems sit where those meet: making data feel instant, making interfaces that hold
              up for everyone, and adding the small touches that make people smile.
            </p>
            <p>
              Outside of work I write tutorials on this site, contribute to open source, and spend
              far too long tuning spring animations. If you want to work together or just say hi,{" "}
              <Link href="/contact">my inbox is open</Link>.
            </p>
          </div>
        </section>

        <section aria-labelledby="experience-heading" className={styles.section}>
          <h2 id="experience-heading" className={styles.sectionTitle}>
            Experience
          </h2>
          <ol className={styles.timeline}>
            {experience.map((job) => (
              <li key={job.company} className={styles.job} data-spotlight>
                <p className={styles.dates}>
                  {job.start} — {job.end}
                </p>
                <div>
                  <h3 className={styles.jobTitle}>
                    {job.role} · <span>{job.company}</span>
                  </h3>
                  <p className={styles.jobText}>{job.description}</p>
                  <ul className={styles.tags}>
                    {job.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="toolbox-heading" className={styles.section}>
          <h2 id="toolbox-heading" className={styles.sectionTitle}>
            Toolbox
          </h2>
          <div className={styles.toolbox}>
            {toolbox.map((t) => (
              <div key={t.group}>
                <h3 className={styles.toolGroup}>{t.group}</h3>
                <ul className={styles.toolList}>
                  {t.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
