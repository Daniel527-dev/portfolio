import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { cache } from "react";

// Articles are .mdx files in /content/posts. The filename is the slug and the
// frontmatter carries title, abstract, date, category and an optional `draft` flag.

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  abstract: string;
  publishedOn: string;
  updatedOn?: string;
  category: string;
  minutes: number;
};

export type Post = PostMeta & { body: string; headings: Heading[] };
export type Heading = { id: string; text: string; level: 2 | 3 };

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(body: string): Heading[] {
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^(##|###)\s+(.+)$/gm)].map((m) => ({
    level: m[1].length as 2 | 3,
    text: m[2].replace(/`/g, ""),
    id: slugify(m[2]),
  }));
}

function readPost(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title),
    abstract: String(data.abstract),
    publishedOn: new Date(data.publishedOn).toISOString(),
    updatedOn: data.updatedOn ? new Date(data.updatedOn).toISOString() : undefined,
    category: String(data.category),
    minutes: Math.max(1, Math.round(readingTime(content).minutes)),
    body: content,
    headings: extractHeadings(content),
  };
}

export const getAllPosts = cache((): Post[] => {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
});

export function getPostMetas(): PostMeta[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return getAllPosts().map(({ body, headings, ...meta }) => meta);
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

export function formatDate(iso: string, month: "long" | "short" = "long") {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}
