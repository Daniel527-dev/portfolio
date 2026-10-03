import Link from "next/link";
import ImpactStats from "@/components/ImpactStats";
import Mascot from "@/components/Mascot";
import NewsletterForm from "@/components/NewsletterForm";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import RotatingWord from "@/components/RotatingWord";
import Sparkles from "@/components/Sparkles";
import { ArrowRightIcon } from "@/components/icons";
import { getPostMetas } from "@/lib/content";
import { getAllViews, getDb, listProjects } from "@/lib/db";
import { categories, highlights, site } from "@/site.config";
import styles from "./page.module.css";

// "Popular" comes from live view counts, so refresh the page once a minute.
export const revalidate = 60;

export default function Home() {
  const posts = getPostMetas();
  const db = getDb();
  const views = getAllViews(db);
  // Featured work first; until something is featured, show the newest three.
  const featured = listProjects(db, { featuredOnly: true });
  const selected = (featured.length > 0 ? featured : listProjects(db)).slice(0, 3);
  const popular = [...posts]
    .sort((a, b) => (views.get(b.slug) ?? 0) - (views.get(a.slug) ?? 0))
    .slice(0, 5);

  return (
    <>
      <section className={styles.hero}>
        <div className={`wrapper ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className="eyebrow">
              Hi, I&apos;m {site.shortName} <span className={styles.wave}>👋</span>
            </p>
            <h1 className={styles.heroTitle}>
              I design{" "}
              <Sparkles>
                <RotatingWord words={["software", "dashboards", "interfaces", "products"]} />
              </Sparkles>
              <br />
              people enjoy using.
            </h1>
            <p className={styles.heroLede}>
              I&apos;m a senior UI/UX designer and design technologist with 10 years of
              experience. I design product interfaces, data-heavy dashboards and brand systems,
              then build them in React and TypeScript so the design holds up in production.
            </p>
            <div className={styles.ctas}>
              <Link href="/projects" className={styles.primaryCta}>
                See my work <ArrowRightIcon size={18} />
              </Link>
              <Link href="/blog" className={styles.secondaryCta}>
                Read the articles
              </Link>
            </div>
          </div>
          <div className={styles.heroArt}>
            <Mascot />
          </div>
        </div>
        <svg className={styles.heroWave} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30c180 30 360 30 540 10S900-10 1080 10s300 30 360 20v30H0z" />
        </svg>
      </section>

      <section className={`wrapper ${styles.impact}`} aria-label="Highlights">
        <ImpactStats stats={highlights} />
      </section>

      {selected.length > 0 && (
      <section className={`wrapper ${styles.projects}`} aria-labelledby="projects-heading">
        <div className={styles.projectsHeader} data-reveal>
          <h2 id="projects-heading" className={styles.sectionTitle}>
            Selected Projects
          </h2>
          <Link href="/projects" className={styles.allLink}>
            All projects <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div className={styles.projectGrid}>
          {selected.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
      )}

      <div className={`wrapper ${styles.columns}`}>
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className={styles.sectionTitle} data-reveal>
            Recently Published
          </h2>
          <div className={styles.postList}>
            {posts.slice(0, 5).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Link href="/blog" className={styles.allLink}>
            View all articles <ArrowRightIcon size={16} />
          </Link>
        </section>

        <aside className={styles.sidebar}>
          <section aria-labelledby="categories-heading" data-reveal>
            <h2 id="categories-heading" className={styles.sideTitle}>
              Browse by Category
            </h2>
            <ul className={styles.pills}>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className={styles.pill}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="popular-heading" data-reveal>
            <h2 id="popular-heading" className={styles.sideTitle}>
              Popular Content
            </h2>
            <ol className={styles.popular}>
              {popular.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <div className={`wrapper ${styles.newsletter}`} data-reveal>
        <NewsletterForm />
      </div>
    </>
  );
}
