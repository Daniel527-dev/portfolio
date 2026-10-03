import type { Project } from "@/lib/db";
import { projectImageUrl } from "@/lib/projects";
import ImageZoom from "./ImageZoom";
import styles from "./ProjectCard.module.css";

// One entry of the work history: the image, title, year, a short description and tags.
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card} data-spotlight>
      <ImageZoom src={projectImageUrl(project.image)} alt={`Screenshot of ${project.title}`} caption={project.title} />
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={styles.year}>{project.year}</span>
        </div>
        <p className={styles.description}>{project.summary}</p>
        {project.tags.length > 0 && (
          <ul className={styles.tags} aria-label="Tools and skills">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
