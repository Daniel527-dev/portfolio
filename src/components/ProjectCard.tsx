import type { Project } from "@/lib/db";
import { projectImageUrl } from "@/lib/projects";
import ProjectGallery from "./ProjectGallery";
import styles from "./ProjectCard.module.css";

// One entry of the work history: the cover, own samples and credited references,
// title, year, a short description and tags. Clicking anywhere on it opens the images.
export default function ProjectCard({ project }: { project: Project }) {
  const own = project.samples.filter((s) => s.kind === "sample");
  const references = project.samples.filter((s) => s.kind === "reference");
  return (
    <article className={styles.card} data-spotlight data-reveal>
      <ProjectGallery
        title={project.title}
        images={[
          { src: projectImageUrl(project.image), alt: `Cover image for ${project.title}`, caption: "", kind: "own" },
          ...own.map((s) => ({
            src: projectImageUrl(s.image),
            alt: s.caption || `Sample image for ${project.title}`,
            caption: s.caption,
            kind: "own" as const,
          })),
          ...references.map((r) => ({
            src: projectImageUrl(r.image),
            alt: `Reference: ${r.caption} by ${r.credit}`,
            caption: r.caption,
            kind: "reference" as const,
            credit: r.credit,
            sourceUrl: r.sourceUrl,
          })),
        ]}
      >
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
      </ProjectGallery>
    </article>
  );
}
