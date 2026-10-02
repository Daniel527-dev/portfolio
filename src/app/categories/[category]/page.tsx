import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import { categories, categoryLabel } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[category]">): Promise<Metadata> {
  const label = categoryLabel((await params).category);
  return { title: `${label} articles`, description: `Articles and tutorials about ${label}.` };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[category]">) {
  const { category } = await params;
  return <BlogIndex active={category} />;
}
