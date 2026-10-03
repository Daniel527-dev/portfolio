import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import {
  addLikes,
  addMessage,
  addProject,
  addProjectImage,
  addSubscriber,
  deleteMessage,
  deleteProject,
  deleteProjectImage,
  getAllLikes,
  getProjectImage,
  getLikes,
  getViews,
  incrementViews,
  listMessages,
  listProjects,
  listSubscribers,
  MAX_LIKES_PER_VISITOR,
  openDatabase,
  seedProjectSamplesOnce,
  seedProjectsOnce,
  setProjectFeatured,
  setProjectImageCaption,
} from "../src/lib/db.ts";

let db: ReturnType<typeof openDatabase>;
beforeEach(() => {
  db = openDatabase(":memory:");
});

describe("views", () => {
  test("start at zero and increment", () => {
    assert.equal(getViews(db, "post"), 0);
    assert.equal(incrementViews(db, "post"), 1);
    assert.equal(incrementViews(db, "post"), 2);
    assert.equal(getViews(db, "post"), 2);
    assert.equal(getViews(db, "other"), 0);
  });
});

describe("likes", () => {
  test("sum across visitors and track each visitor separately", () => {
    addLikes(db, "post", "alice", 3);
    const result = addLikes(db, "post", "bob", 2);
    assert.deepEqual(result, { total: 5, mine: 2 });
    assert.deepEqual(getLikes(db, "post", "alice"), { total: 5, mine: 3 });
    assert.equal(getAllLikes(db).get("post"), 5);
  });

  test("never exceed the per-visitor cap", () => {
    addLikes(db, "post", "alice", 7);
    addLikes(db, "post", "alice", 7);
    assert.deepEqual(getLikes(db, "post", "alice"), { total: MAX_LIKES_PER_VISITOR, mine: MAX_LIKES_PER_VISITOR });
    addLikes(db, "post", "carol", 999);
    assert.equal(getLikes(db, "post", "carol").mine, MAX_LIKES_PER_VISITOR);
  });

  test("treat zero, negative and fractional amounts as one like", () => {
    addLikes(db, "post", "alice", 0);
    addLikes(db, "post", "alice", -5);
    addLikes(db, "post", "alice", 0.4);
    assert.equal(getLikes(db, "post", "alice").mine, 3);
  });
});

describe("subscribers", () => {
  test("ignore duplicate emails", () => {
    assert.equal(addSubscriber(db, "a@example.com"), true);
    assert.equal(addSubscriber(db, "a@example.com"), false);
    assert.equal(listSubscribers(db).length, 1);
  });
});

describe("messages", () => {
  test("store, list newest first and delete", () => {
    const first = addMessage(db, { name: "A", email: "a@example.com", body: "First message" });
    addMessage(db, { name: "B", email: "b@example.com", body: "Second message" });
    assert.deepEqual(
      listMessages(db).map((m) => m.name),
      ["B", "A"],
    );
    deleteMessage(db, first);
    assert.equal(listMessages(db).length, 1);
  });
});

describe("projects", () => {
  const base = { summary: "A short description.", tags: ["Figma", "React"], featured: false };

  test("list newest year first, then newest upload", () => {
    addProject(db, { ...base, title: "Old", year: 2023, image: "a.png" });
    addProject(db, { ...base, title: "New A", year: 2026, image: "b.png" });
    addProject(db, { ...base, title: "New B", year: 2026, image: "c.png" });
    assert.deepEqual(
      listProjects(db).map((p) => p.title),
      ["New B", "New A", "Old"],
    );
    assert.deepEqual(listProjects(db)[0].tags, ["Figma", "React"]);
  });

  test("feature, filter and delete", () => {
    const id = addProject(db, { ...base, title: "Hero", year: 2025, image: "h.png" });
    addProject(db, { ...base, title: "Other", year: 2025, image: "o.png" });
    assert.equal(listProjects(db, { featuredOnly: true }).length, 0);
    setProjectFeatured(db, id, true);
    assert.deepEqual(
      listProjects(db, { featuredOnly: true }).map((p) => p.title),
      ["Hero"],
    );
    assert.equal(deleteProject(db, id)?.image, "h.png");
    assert.equal(deleteProject(db, id), undefined);
    assert.equal(listProjects(db).length, 1);
  });

  test("seed the starting history once, even after it is deleted", () => {
    const seed = [
      { ...base, title: "Seeded A", year: 2024, image: "seed-a.png", featured: true },
      { ...base, title: "Seeded B", year: 2020, image: "seed-b.png" },
    ];
    assert.equal(seedProjectsOnce(db, seed), true);
    assert.deepEqual(
      listProjects(db, { featuredOnly: true }).map((p) => p.title),
      ["Seeded A"],
    );
    for (const p of listProjects(db)) deleteProject(db, p.id);
    assert.equal(seedProjectsOnce(db, seed), false);
    assert.equal(listProjects(db).length, 0);
  });
});

describe("project samples", () => {
  const base = { summary: "A short description.", tags: [], featured: false, year: 2024 };

  test("attach in upload order, recaption and delete with their project", () => {
    const id = addProject(db, { ...base, title: "With samples", image: "cover.png" });
    const first = addProjectImage(db, { projectId: id, image: "s1.png", caption: "First" });
    addProjectImage(db, { projectId: id, image: "s2.png", caption: "" });
    assert.deepEqual(listProjects(db)[0].samples.map((s) => s.image), ["s1.png", "s2.png"]);

    setProjectImageCaption(db, first, "Renamed");
    assert.equal(getProjectImage(db, first)?.caption, "Renamed");
    assert.equal(deleteProjectImage(db, first)?.image, "s1.png");
    assert.equal(getProjectImage(db, first), undefined);

    const removed = deleteProject(db, id);
    assert.deepEqual(removed?.samples.map((s) => s.image), ["s2.png"]);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM project_images").get()?.n, 0);
  });

  test("seed with projects on a fresh database, and only once", () => {
    const seed = [{ ...base, title: "Seeded", image: "seed-a.png", samples: [{ image: "seed-a-1.png", caption: "c" }] }];
    assert.equal(seedProjectsOnce(db, seed), true);
    assert.equal(seedProjectSamplesOnce(db, seed), false);
    assert.equal(listProjects(db)[0].samples.length, 1);
  });

  test("backfill databases seeded before galleries existed", () => {
    addProject(db, { ...base, title: "Old seed", image: "seed-a.png" });
    const kept = addProject(db, { ...base, title: "Has own samples", image: "seed-b.png" });
    addProjectImage(db, { projectId: kept, image: "mine.png", caption: "" });
    db.prepare("INSERT INTO meta (key, value) VALUES ('projects_seeded', 'earlier')").run();
    const seed = [
      { ...base, title: "Old seed", image: "seed-a.png", samples: [{ image: "seed-a-1.png", caption: "c" }] },
      { ...base, title: "Has own samples", image: "seed-b.png", samples: [{ image: "seed-b-1.png", caption: "c" }] },
      { ...base, title: "Deleted by owner", image: "seed-c.png", samples: [{ image: "seed-c-1.png", caption: "c" }] },
    ];
    assert.equal(seedProjectsOnce(db, seed), false);
    assert.equal(seedProjectSamplesOnce(db, seed), true);
    const byTitle = new Map(listProjects(db).map((p) => [p.title, p.samples.map((s) => s.image)]));
    assert.deepEqual(byTitle.get("Old seed"), ["seed-a-1.png"]);
    assert.deepEqual(byTitle.get("Has own samples"), ["mine.png"]);
    assert.equal(byTitle.size, 2);
    assert.equal(seedProjectSamplesOnce(db, seed), false);
  });
});
