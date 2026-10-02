import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { categoryLabel } from "@/site.config";
import { ArrowRightIcon } from "./icons";
import styles from "./PostCard.module.css";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <Link href={`/categories/${post.category}`} className={styles.category}>
          {categoryLabel(post.category)}
        </Link>
        <span aria-hidden="true">·</span>
        <time dateTime={post.publishedOn}>{formatDate(post.publishedOn, "short")}</time>
        <span aria-hidden="true">·</span>
        <span>{post.minutes} min read</span>
      </div>
      <h3 className={styles.title}>
        <Link href={`/blog/${post.slug}`} className={styles.link}>
          {post.title}
        </Link>
      </h3>
      <p className={styles.abstract}>{post.abstract}</p>
      <span className={styles.more} aria-hidden="true">
        Read more <ArrowRightIcon size={16} />
      </span>
    </article>
  );
}
