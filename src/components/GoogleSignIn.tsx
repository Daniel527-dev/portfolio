"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./GoogleSignIn.module.css";

// Minimal typing for the Google Identity Services script.
type GoogleId = {
  initialize(opts: { client_id: string; callback: (r: { credential: string }) => void }): void;
  renderButton(el: HTMLElement, opts: Record<string, string | number>): void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

// Renders Google's "Sign in with Google" button and trades the returned
// credential for an owner session on our server.
export default function GoogleSignIn({ clientId }: { clientId: string }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onCredential({ credential }: { credential: string }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Sign-in failed.");
      else router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function renderButton() {
    const id = window.google?.accounts.id;
    if (!id || !buttonRef.current) return;
    id.initialize({ client_id: clientId, callback: onCredential });
    id.renderButton(buttonRef.current, { theme: "outline", size: "large", shape: "pill", text: "signin_with" });
  }

  return (
    <div className={styles.wrapper}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={renderButton} />
      <div ref={buttonRef} className={styles.button} aria-busy={busy} />
      {busy && <p className={styles.status}>Checking your Google account…</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
