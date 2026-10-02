import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import * as runtime from "react/jsx-runtime";
import Callout from "@/components/mdx/Callout";
import CleanupDemo from "@/components/mdx/CleanupDemo";
import CodeBlock from "@/components/mdx/CodeBlock";
import FlexPlayground from "@/components/mdx/FlexPlayground";
import SpringDemo from "@/components/mdx/SpringDemo";
import { slugify } from "./content";

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node)
    return textOf((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  return "";
}

// Headings get the same ids the table of contents computes from the raw source.
function heading(Tag: "h2" | "h3") {
  return function Heading({ children }: { children?: React.ReactNode }) {
    const id = slugify(textOf(children));
    return (
      <Tag id={id}>
        <a href={`#${id}`} className="heading-anchor">
          {children}
        </a>
      </Tag>
    );
  };
}

const components: MDXComponents = {
  h2: heading("h2"),
  h3: heading("h3"),
  pre: CodeBlock,
  a: ({ href = "", children }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  Callout,
  SpringDemo,
  FlexPlayground,
  CleanupDemo,
};

export async function renderMdx(source: string) {
  const { default: Content } = await evaluate(source, {
    ...(runtime as Pick<typeof runtime, "Fragment" | "jsx" | "jsxs">),
    development: false,
  });
  return <Content components={components} />;
}
