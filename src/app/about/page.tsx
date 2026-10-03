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
  {
    group: "Design",
    items: ["Figma", "Design tokens", "Prototyping", "Typography & color", "Iconography", "Webflow"],
  },
  {
    group: "Front end",
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "CSS / SCSS", "Framer Motion", "WebGL & Canvas"],
  },
  {
    group: "Research & quality",
    items: ["Usability testing", "A/B testing", "Product analytics", "WCAG 2.1 / 2.2 AA", "Core Web Vitals", "Design QA"],
  },
];

const education = [
  { years: "2014 — 2016", degree: "M.F.A., Graphic Design", school: "California College of the Arts" },
  { years: "2010 — 2014", degree: "B.S., Interaction Design", school: "ArtCenter College of Design" },
];

export default function AboutPage() {
  return (
    <div className={`wrapper ${styles.page}`}>
      <aside className={styles.side} data-reveal>
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
          <h2 id="about-heading" className={styles.sectionTitle} data-reveal>
            About
          </h2>
          <div className={styles.bio} data-reveal>
            <p>
              I&apos;m a UI/UX designer and design technologist with 10 years of experience. I
              trained in interaction design at ArtCenter and graphic design at California College
              of the Arts, and I&apos;ve spent my career where design and code meet.
            </p>
            <p>
              Most of my work is UI for software: data-heavy dashboards, search and filtering,
              and the design systems behind them. At Supplyframe I redesigned dashboards used by
              more than 10 million hardware engineers. At RG Pacific I built multi-brand Figma
              systems whose tokens flow straight into Tailwind CSS and React.
            </p>
            <p>
              I also love brand design. I&apos;ve built brand systems from type and color through
              to voice, and I make sure they carry into the product itself, not just the
              marketing site. If you want to work together or just say hi,{" "}
              <Link href="/contact">my inbox is open</Link>.
            </p>
          </div>
        </section>

        <section aria-labelledby="experience-heading" className={styles.section}>
          <h2 id="experience-heading" className={styles.sectionTitle} data-reveal>
            Experience
          </h2>
          <ol className={styles.timeline}>
            {experience.map((job) => (
              <li key={job.company} className={styles.job} data-spotlight data-reveal>
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
          <h2 id="toolbox-heading" className={styles.sectionTitle} data-reveal>
            Toolbox
          </h2>
          <div className={styles.toolbox}>
            {toolbox.map((t) => (
              <div key={t.group} data-reveal>
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

        <section aria-labelledby="education-heading" className={styles.section}>
          <h2 id="education-heading" className={styles.sectionTitle} data-reveal>
            Education &amp; Recognition
          </h2>
          <ol className={styles.timeline}>
            {education.map((e) => (
              <li key={e.degree} className={styles.job} data-reveal>
                <p className={styles.dates}>{e.years}</p>
                <div>
                  <h3 className={styles.jobTitle}>
                    {e.degree} · <span>{e.school}</span>
                  </h3>
                </div>
              </li>
            ))}
            <li className={styles.job} data-reveal>
              <p className={styles.dates}>Awards</p>
              <div>
                <h3 className={styles.jobTitle}>
                  ADDY and Davey Creative Awards · <span>Ayzenberg Group</span>
                </h3>
                <p className={styles.jobText}>
                  Contributor to immersive storytelling experiences recognized with three awards.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
