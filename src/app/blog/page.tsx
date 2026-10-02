import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";

export const metadata: Metadata = {
  title: "Articles & Tutorials",
  description: "Deep dives, interactive explainers and lessons learned while building for the web.",
};

export default function BlogPage() {
  return <BlogIndex />;
}
