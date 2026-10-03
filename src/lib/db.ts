import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// One SQLite file holds every piece of dynamic state: likes, views,
// newsletter subscribers, contact messages and the project history
// (images themselves are files, see storage.ts). node:sqlite ships with
// Node 22.5+, so there is no native module to compile.

export const MAX_LIKES_PER_VISITOR = 10;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS views (
    slug  TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS likes (
    slug    TEXT NOT NULL,
    visitor TEXT NOT NULL,
    count   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (slug, visitor)
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    body       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS projects (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    summary    TEXT NOT NULL,
    year       INTEGER NOT NULL,
    tags       TEXT NOT NULL DEFAULT '[]',
    image      TEXT NOT NULL,
    featured   INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export function openDatabase(file: string) {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA busy_timeout = 3000;");
  db.exec(SCHEMA);
  return db;
}

// Where the database and uploaded images live. Serverless hosts (Netlify, Vercel,
// AWS Lambda) mount the app read-only and only allow writes to the temp dir, so
// fall back there when ./data isn't writable. The temp dir does not survive cold
// starts or redeploys.
let resolvedDataDir: string | undefined;
export function dataDir() {
  if (resolvedDataDir) return resolvedDataDir;
  const dir = path.join(process.cwd(), "data");
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    resolvedDataDir = dir;
  } catch {
    resolvedDataDir = path.join(os.tmpdir(), "portfolio-data");
    fs.mkdirSync(resolvedDataDir, { recursive: true });
    console.warn(`[db] ${dir} is not writable; using ${resolvedDataDir} (not persistent).`);
  }
  return resolvedDataDir;
}

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { __portfolioDb?: DatabaseSync };

export function getDb() {
  if (!globalForDb.__portfolioDb) {
    const file = process.env.DATABASE_PATH ?? path.join(dataDir(), "portfolio.db");
    globalForDb.__portfolioDb = openDatabase(file);
  }
  return globalForDb.__portfolioDb;
}

/* ---------- views ---------- */

export function incrementViews(db: DatabaseSync, slug: string) {
  const row = db
    .prepare(
      `INSERT INTO views (slug, count) VALUES (?, 1)
       ON CONFLICT(slug) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .get(slug) as { count: number };
  return row.count;
}

export function getViews(db: DatabaseSync, slug: string) {
  const row = db.prepare("SELECT count FROM views WHERE slug = ?").get(slug) as
    | { count: number }
    | undefined;
  return row?.count ?? 0;
}

export function getAllViews(db: DatabaseSync) {
  const rows = db.prepare("SELECT slug, count FROM views").all() as {
    slug: string;
    count: number;
  }[];
  return new Map(rows.map((r) => [r.slug, r.count]));
}

/* ---------- likes ---------- */

export function getLikes(db: DatabaseSync, slug: string, visitor: string) {
  const total = db
    .prepare("SELECT COALESCE(SUM(count), 0) AS total FROM likes WHERE slug = ?")
    .get(slug) as { total: number };
  const mine = db
    .prepare("SELECT count FROM likes WHERE slug = ? AND visitor = ?")
    .get(slug, visitor) as { count: number } | undefined;
  return { total: Number(total.total), mine: mine?.count ?? 0 };
}

/** Adds up to `amount` likes, capped so one visitor never exceeds MAX_LIKES_PER_VISITOR. */
export function addLikes(db: DatabaseSync, slug: string, visitor: string, amount: number) {
  const step = Math.max(1, Math.min(MAX_LIKES_PER_VISITOR, Math.floor(amount)));
  db.prepare(
    `INSERT INTO likes (slug, visitor, count) VALUES (?, ?, MIN(?, ?))
     ON CONFLICT(slug, visitor) DO UPDATE SET count = MIN(count + ?, ?)`,
  ).run(slug, visitor, step, MAX_LIKES_PER_VISITOR, step, MAX_LIKES_PER_VISITOR);
  return getLikes(db, slug, visitor);
}

export function getAllLikes(db: DatabaseSync) {
  const rows = db
    .prepare("SELECT slug, SUM(count) AS total FROM likes GROUP BY slug")
    .all() as { slug: string; total: number }[];
  return new Map(rows.map((r) => [r.slug, Number(r.total)]));
}

/* ---------- newsletter ---------- */

/** Returns false when the address is already subscribed. */
export function addSubscriber(db: DatabaseSync, email: string) {
  const result = db
    .prepare("INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING")
    .run(email);
  return Number(result.changes) > 0;
}

export function listSubscribers(db: DatabaseSync) {
  return db
    .prepare("SELECT id, email, created_at FROM subscribers ORDER BY id DESC")
    .all() as { id: number; email: string; created_at: string }[];
}

/* ---------- contact messages ---------- */

export function addMessage(
  db: DatabaseSync,
  msg: { name: string; email: string; body: string },
) {
  const result = db
    .prepare("INSERT INTO messages (name, email, body) VALUES (?, ?, ?)")
    .run(msg.name, msg.email, msg.body);
  return Number(result.lastInsertRowid);
}

export function listMessages(db: DatabaseSync) {
  return db
    .prepare("SELECT id, name, email, body, created_at FROM messages ORDER BY id DESC")
    .all() as { id: number; name: string; email: string; body: string; created_at: string }[];
}

export function deleteMessage(db: DatabaseSync, id: number) {
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}

/* ---------- projects (work history) ---------- */

export type Project = {
  id: number;
  title: string;
  summary: string;
  year: number;
  tags: string[];
  /** File name of the image in the uploads directory. */
  image: string;
  featured: boolean;
  createdAt: string;
};

type ProjectRow = {
  id: number;
  title: string;
  summary: string;
  year: number;
  tags: string;
  image: string;
  featured: number;
  created_at: string;
};

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    year: row.year,
    tags: JSON.parse(row.tags) as string[],
    image: row.image,
    featured: row.featured === 1,
    createdAt: row.created_at,
  };
}

export function addProject(
  db: DatabaseSync,
  p: { title: string; summary: string; year: number; tags: string[]; image: string; featured: boolean },
) {
  const result = db
    .prepare(
      "INSERT INTO projects (title, summary, year, tags, image, featured) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(p.title, p.summary, p.year, JSON.stringify(p.tags), p.image, p.featured ? 1 : 0);
  return Number(result.lastInsertRowid);
}

/** Newest work first; ties broken by upload order. */
export function listProjects(db: DatabaseSync, { featuredOnly = false } = {}) {
  const where = featuredOnly ? "WHERE featured = 1" : "";
  const rows = db
    .prepare(`SELECT * FROM projects ${where} ORDER BY year DESC, id DESC`)
    .all() as ProjectRow[];
  return rows.map(toProject);
}

export function getProject(db: DatabaseSync, id: number) {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRow | undefined;
  return row ? toProject(row) : undefined;
}

export function setProjectFeatured(db: DatabaseSync, id: number, featured: boolean) {
  db.prepare("UPDATE projects SET featured = ? WHERE id = ?").run(featured ? 1 : 0, id);
}

/** Deletes the row and returns it, so the caller can remove the image file too. */
export function deleteProject(db: DatabaseSync, id: number) {
  const project = getProject(db, id);
  if (project) db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  return project;
}
