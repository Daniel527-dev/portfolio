"use client";

import { useState } from "react";
import { sounds } from "@/lib/sound";
import { CheckIcon, CopyIcon } from "../icons";
import styles from "./mdx.module.css";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      sounds.click();
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (e.g. insecure origin); fail quietly.
    }
  }

  return (
    <button className={styles.copyButton} onClick={copy} aria-label="Copy code to clipboard">
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
