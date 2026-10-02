import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { getPostMetas } from "@/lib/content";
import { getAllLikes, getAllViews, getDb, listMessages, listSubscribers } from "@/lib/db";
import { login, logout, removeMessage } from "./actions";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

const ERRORS: Record<string, string> = {
  invalid: "That password isn't right.",
  locked: "Too many attempts. Wait 15 minutes and try again.",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { error } = await searchParams;

  if (!adminConfigured()) {
    return (
      <div className={`wrapper ${styles.narrow}`}>
        <h1 className="page-title">Dashboard</h1>
        <p className="lede">
          Set <code>ADMIN_PASSWORD</code> (and <code>SESSION_SECRET</code>) in <code>.env.local</code>{" "}
          and restart the server to enable the dashboard.
        </p>
      </div>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className={`wrapper ${styles.narrow}`}>
        <h1 className="page-title">Dashboard</h1>
        <p className="lede">Sign in to see subscribers, messages and article stats.</p>
        <form action={login} className={styles.login}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          {typeof error === "string" && ERRORS[error] && (
            <p className={styles.error} role="alert">
              {ERRORS[error]}
            </p>
          )}
          <button className={styles.button}>Sign in</button>
        </form>
      </div>
    );
  }

  const db = getDb();
  const views = getAllViews(db);
  const likes = getAllLikes(db);
  const posts = getPostMetas();
  const subscribers = listSubscribers(db);
  const messages = listMessages(db);
  const totalViews = [...views.values()].reduce((a, b) => a + b, 0);
  const totalLikes = [...likes.values()].reduce((a, b) => a + b, 0);

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.top}>
        <h1 className="page-title">Dashboard</h1>
        <form action={logout}>
          <button className={styles.ghost}>Sign out</button>
        </form>
      </div>

      <div className={styles.stats}>
        <Stat label="Articles" value={posts.length} />
        <Stat label="Total views" value={totalViews} />
        <Stat label="Total likes" value={totalLikes} />
        <Stat label="Subscribers" value={subscribers.length} />
        <Stat label="Messages" value={messages.length} />
      </div>

      <section className={styles.section}>
        <h2>Articles</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Views</th>
                <th>Likes</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <a href={`/blog/${p.slug}`}>{p.title}</a>
                  </td>
                  <td>{views.get(p.slug) ?? 0}</td>
                  <td>{likes.get(p.slug) ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Messages</h2>
        {messages.length === 0 ? (
          <p className={styles.empty}>No messages yet.</p>
        ) : (
          <ul className={styles.messages}>
            {messages.map((m) => (
              <li key={m.id} className={styles.message}>
                <div className={styles.messageHead}>
                  <strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a>
                  <time className={styles.time}>{m.created_at} UTC</time>
                </div>
                <p className={styles.messageBody}>{m.body}</p>
                <form action={removeMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className={styles.ghost}>Delete</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2>Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className={styles.empty}>No subscribers yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Joined (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>{s.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.stat}>
      <p className={styles.statValue}>{value.toLocaleString("en-US")}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
