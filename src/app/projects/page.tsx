import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { getDb, listProjects } from "@/lib/db";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "A history of my work.",
};

// The history is managed from /admin, so always render the latest list.
export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = listProjects(getDb());

  return (
    <div className={`wrapper ${styles.page}`}>
      <p className="eyebrow" data-reveal>Work history</p>
      <h1 className="page-title" data-reveal>Projects</h1>
      <p className="lede" data-reveal>
        A selection of things I&apos;ve designed and built, newest first. Click an image to see it
        larger.
      </p>
      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji} aria-hidden="true">
            🛠️
          </p>
          <p className={styles.emptyTitle}>New work is on its way</p>
          <p>Projects will appear here as soon as they&apos;re published.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
