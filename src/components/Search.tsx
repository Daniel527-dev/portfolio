"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons";
import headerStyles from "./Header.module.css";
import styles from "./Search.module.css";

export type SearchItem = {
  title: string;
  abstract: string;
  href: string;
  category: string;
};

function score(item: SearchItem, terms: string[]) {
  const title = item.title.toLowerCase();
  const text = `${title} ${item.abstract.toLowerCase()} ${item.category.toLowerCase()}`;
  let total = 0;
  for (const term of terms) {
    if (!text.includes(term)) return 0;
    total += title.includes(term) ? 3 : 1;
  }
  return total;
}

export default function Search({ items }: { items: SearchItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return items.slice(0, 6);
    return items
      .map((item) => ({ item, s: score(item, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.item);
  }, [items, query]);

  function open() {
    setQuery("");
    setActive(0);
    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function close() {
    dialogRef.current?.close();
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  }

  return (
    <>
      <button
        className={headerStyles.iconButton}
        onClick={open}
        aria-label="Search articles"
        title="Search (Ctrl + K)"
      >
        <SearchIcon />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Search articles"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.inputRow}>
            <SearchIcon size={20} />
            <input
              ref={inputRef}
              className={styles.input}
              type="search"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              aria-controls="search-results"
              aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
            />
            <kbd className={styles.kbd}>Esc</kbd>
          </div>
          <ul id="search-results" className={styles.results} role="listbox">
            {results.length === 0 && <li className={styles.empty}>No articles match “{query}”.</li>}
            {results.map((item, i) => (
              <li
                key={item.href}
                id={`search-result-${i}`}
                role="option"
                aria-selected={i === active}
                className={styles.result}
                data-active={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item.href)}
              >
                <span className={styles.resultCategory}>{item.category}</span>
                <span className={styles.resultTitle}>{item.title}</span>
                <span className={styles.resultAbstract}>{item.abstract}</span>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
