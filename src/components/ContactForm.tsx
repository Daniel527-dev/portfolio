"use client";

import { useState } from "react";
import { sounds } from "@/lib/sound";
import styles from "./ContactForm.module.css";

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const payload = Object.fromEntries(new FormData(formEl));
    setSending(true);
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Something went wrong." });
        return;
      }
      formEl.reset();
      setSent(true);
      sounds.success();
    } catch {
      setErrors({ form: "Couldn't reach the server. Please try again." });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.sent} role="status">
        <p className={styles.sentEmoji} aria-hidden="true">
          📬
        </p>
        <h2>Message sent!</h2>
        <p>Thanks for reaching out. I read everything and usually reply within a couple of days.</p>
        <button className={styles.ghost} onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={100} {...field("name")} />
          {errors.name && <p id="name-error" className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required {...field("email")} />
          {errors.email && <p id="email-error" className={styles.error}>{errors.email}</p>}
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={7} required maxLength={5000} {...field("message")} />
        {errors.message && <p id="message-error" className={styles.error}>{errors.message}</p>}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {errors.form && (
        <p className={styles.error} role="alert">
          {errors.form}
        </p>
      )}
      <button className={styles.submit} disabled={sending}>
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
