import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import {
  addLikes,
  addMessage,
  addSubscriber,
  deleteMessage,
  getAllLikes,
  getLikes,
  getViews,
  incrementViews,
  listMessages,
  listSubscribers,
  MAX_LIKES_PER_VISITOR,
  openDatabase,
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
