"use client";

import { useState } from "react";
import { sounds } from "@/lib/sound";
import styles from "./NewsletterForm.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; already: boolean }
  | { kind: "error"; message: string };

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "loading" });
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: form.get("company") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.errors?.email ?? data.error ?? "Something went wrong." });
        return;
      }
      setStatus({ kind: "success", already: data.alreadySubscribed });
      setEmail("");
      sounds.success();
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Please try again." });
    }
  }

  return (
    <section className={styles.card} aria-labelledby="newsletter-heading">
      <div className={styles.blob} aria-hidden="true" />
      <h2 id="newsletter-heading" className={styles.heading}>
        Want to know when I publish something new?
      </h2>
      <p className={styles.text}>
        I send a short email when there&apos;s a new article or project, usually a couple of times a
        month. No spam, and you can unsubscribe whenever you like.
      </p>

      {status.kind === "success" ? (
        <p className={styles.success} role="status">
          {status.already
            ? "You're already on the list. Thanks for being here! 💜"
            : "You're in! Keep an eye on your inbox. ✨"}
        </p>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label htmlFor="newsletter-email" className="visually-hidden">
            Email address
          </label>
          <input
            id="newsletter-email"
            className={styles.input}
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={status.kind === "error"}
            aria-describedby={status.kind === "error" ? "newsletter-error" : undefined}
            required
          />
          <div className="honeypot" aria-hidden="true">
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </div>
          <button className={styles.button} disabled={status.kind === "loading"}>
            {status.kind === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
      {status.kind === "error" && (
        <p id="newsletter-error" className={styles.error} role="alert">
          {status.message}
        </p>
      )}
    </section>
  );
}
