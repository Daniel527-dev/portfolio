import { highlight } from "sugar-high";
import { lang as normalizeLang } from "sugar-high/lang";
import CopyButton from "./CopyButton";
import styles from "./mdx.module.css";

const LABELS: Record<string, string> = {
  javascript: "JS",
  typescript: "TS",
  css: "CSS",
  html: "HTML",
  shell: "Shell",
  json: "JSON",
  sql: "SQL",
};

// Replaces MDX's <pre><code class="language-x"> with a highlighted, copyable block.
export default function CodeBlock(props: React.ComponentProps<"pre">) {
  const child = props.children as React.ReactElement<{ className?: string; children?: string }>;
  const code = String(child?.props?.children ?? "").replace(/\n$/, "");
  const fence = child?.props?.className?.replace("language-", "") ?? "";

  let language: ReturnType<typeof normalizeLang> | undefined;
  try {
    language = fence ? normalizeLang(fence) : undefined;
  } catch {
    language = undefined;
  }

  const html = highlight(code, language ? { lang: language } : undefined);

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language ? (LABELS[language] ?? language) : "Code"}</span>
        <CopyButton text={code} />
      </div>
      <pre className={styles.pre}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
