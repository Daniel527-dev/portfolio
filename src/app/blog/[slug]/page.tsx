import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import TableOfContents from "@/components/TableOfContents";
import { formatDate, getAllPosts, getPost } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { categoryLabel } from "@/site.config";
import styles from "./article.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.abstract,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.abstract,
      publishedTime: post.publishedOn,
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const content = await renderMdx(post.body);

  return (
    <article>
      <header className={styles.hero}>
        <div className={`wrapper ${styles.heroInner}`}>
          <Link href={`/categories/${post.category}`} className="eyebrow">
            {categoryLabel(post.category)}
          </Link>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.abstract}>{post.abstract}</p>
          <div className={styles.meta}>
            <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min read</span>
          </div>
        </div>
      </header>

      <div className={`wrapper ${styles.layout}`}>
        <div className={`prose ${styles.content}`}>{content}</div>
        <aside className={styles.aside}>
          <TableOfContents headings={post.headings} />
        </aside>
      </div>

      <div className={`wrapper ${styles.after}`}>
        {post.updatedOn && (
          <p className={styles.updated}>Last updated {formatDate(post.updatedOn)}</p>
        )}

        <nav className={styles.pager} aria-label="More articles">
          {older ? (
            <Link href={`/blog/${older.slug}`} className={styles.pagerLink}>
              <span>← Previous</span>
              {older.title}
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              <span>Next →</span>
              {newer.title}
            </Link>
          )}
        </nav>

        <NewsletterForm />
      </div>
    </article>
  );
}
