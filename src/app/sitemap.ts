import type { MetadataRoute } from "next";
import { getPostMetas } from "@/lib/content";
import { categories, site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/blog", "/projects", "/about", "/contact"].map((p) => ({
    url: `${site.url}${p}`,
  }));
  const posts = getPostMetas().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.updatedOn ?? post.publishedOn,
  }));
  const cats = categories.map((c) => ({ url: `${site.url}/categories/${c.slug}` }));
  return [...pages, ...posts, ...cats];
}
