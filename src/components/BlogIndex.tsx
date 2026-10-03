import Link from "next/link";
import { getPostMetas } from "@/lib/content";
import { categories } from "@/site.config";
import PostCard from "./PostCard";
import styles from "./BlogIndex.module.css";

// Shared by /blog and /categories/[category].
export default function BlogIndex({ active }: { active?: string }) {
  const all = getPostMetas();
  const posts = active ? all.filter((p) => p.category === active) : all;
  const counts = new Map<string, number>();
  for (const p of all) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const activeLabel = categories.find((c) => c.slug === active)?.label;

  return (
    <div className={`wrapper ${styles.page}`}>
      <p className="eyebrow" data-reveal>{activeLabel ? "Category" : "The blog"}</p>
      <h1 className="page-title" data-reveal>{activeLabel ?? "Articles & Tutorials"}</h1>
      <p className="lede" data-reveal>
        {activeLabel
          ? `Everything I've written about ${activeLabel}.`
          : "Deep dives, interactive explainers and lessons learned while building for the web."}
      </p>

      <nav className={styles.filters} aria-label="Filter by category" data-reveal>
        <Link href="/blog" className={styles.filter} aria-current={!active ? "page" : undefined}>
          All <span>{all.length}</span>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className={styles.filter}
            aria-current={active === c.slug ? "page" : undefined}
          >
            {c.label} <span>{counts.get(c.slug) ?? 0}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.empty}>Nothing here yet, but it&apos;s on my list. Check back soon! 🌱</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </div>
  );
}
