import type { projects } from "@/site.config";
import { ExternalIcon } from "./icons";
import styles from "./ProjectCard.module.css";

type Project = (typeof projects)[number];

// Each project gets a generated "cover": layered gradient blobs tinted by its hue,
// so the grid looks lively without shipping any image files.
export default function ProjectCard({ project }: { project: Project }) {
  const style = { "--hue": project.hue } as React.CSSProperties;
  return (
    <article className={styles.card} style={style} data-spotlight>
      <div className={styles.cover} aria-hidden="true">
        <span className={styles.orb1} />
        <span className={styles.orb2} />
        <span className={styles.initial}>{project.title[0]}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            <a href={project.href} target="_blank" rel="noreferrer" className={styles.link}>
              {project.title}
            </a>
          </h3>
          <ExternalIcon size={18} className={styles.icon} />
        </div>
        <p className={styles.year}>{project.year}</p>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tags} aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
