import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/site.config";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built: apps, libraries and experiments.",
};

export default function ProjectsPage() {
  return (
    <div className={`wrapper ${styles.page}`}>
      <p className="eyebrow">Things I&apos;ve made</p>
      <h1 className="page-title">Projects</h1>
      <p className="lede">
        A mix of client work, open-source libraries and weekend experiments. Most of them started
        as &ldquo;I wonder if I could…&rdquo;
      </p>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
