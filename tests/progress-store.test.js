const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScript } = require("./helpers/loadScript.js");

const store = loadScript("ProgressStore.js");

const plain = (value) => JSON.parse(JSON.stringify(value));

const level = { id: "homerow", passAccuracy: 90, passWpm: 0 };

function attempt(accuracy, wpm) {
  return {
    progress: plain(store.defaultProgress()),
    level,
    result: { accuracy, wpm, timeMs: 60000, keyResults: { f: { hits: 10, misses: 0 } } }
  };
}

test("a fresh progress blob is empty but complete", () => {
  const progress = plain(store.defaultProgress());
  assert.equal(progress.version, 1);
  assert.deepEqual(progress.levels, {});
  assert.deepEqual(progress.keyStats, {});
  assert.equal(progress.streak.count, 0);
  assert.equal(progress.streak.lastDay, "");
  assert.equal(progress.totals.sessions, 0);
  assert.equal(progress.unlockAll, false);
});

test("a corrupt or missing file falls back to the defaults", () => {
  assert.deepEqual(plain(store.parse("")), plain(store.defaultProgress()));
  assert.deepEqual(plain(store.parse("{not json")), plain(store.defaultProgress()));
  assert.deepEqual(plain(store.parse("null")), plain(store.defaultProgress()));
});

test("a partial file keeps the fields it has and defaults the rest", () => {
  const progress = plain(store.parse(JSON.stringify({ levels: { homerow: { passed: true } } })));
  assert.equal(progress.levels.homerow.passed, true);
  assert.equal(progress.totals.sessions, 0);
  assert.equal(progress.streak.count, 0);
});

test("a session that meets the bar passes the level", () => {
  const outcome = store.recordAttempt(attempt(95, 40).progress, level, attempt(95, 40).result);
  assert.equal(outcome.passed, true);
  assert.equal(outcome.entry.bestAccuracy, 95);
  assert.equal(outcome.entry.bestWpm, 40);
  assert.equal(outcome.entry.attempts, 1);
});

test("a session below the bar does not pass the level", () => {
  const outcome = store.recordAttempt(attempt(80, 40).progress, level, attempt(80, 40).result);
  assert.equal(outcome.passed, false);
});

test("the best score is kept across sessions", () => {
  const first = store.recordAttempt(attempt(95, 40).progress, level, attempt(95, 40).result);
  const second = store.recordAttempt(first.progress, level, attempt(97, 20).result);
  assert.equal(second.entry.bestAccuracy, 97);
  assert.equal(second.entry.bestWpm, 40);
  assert.equal(second.entry.attempts, 2);
});

test("sessions and key stats are counted", () => {
  const outcome = store.recordAttempt(attempt(95, 40).progress, level, attempt(95, 40).result);
  assert.equal(outcome.progress.totals.sessions, 1);
  assert.equal(outcome.progress.totals.timeMs, 60000);
  assert.equal(outcome.progress.keyStats.f.hits, 10);
  assert.equal(outcome.progress.keyStats.f.misses, 0);
});

test("a level is unlocked only when the previous one was passed", () => {
  const progress = plain(store.defaultProgress());
  const list = [{ id: "a" }, { id: "b" }];
  assert.equal(store.isUnlocked(progress, list, 0), true);
  assert.equal(store.isUnlocked(progress, list, 1), false);

  progress.levels.a = { passed: true };
  assert.equal(store.isUnlocked(progress, list, 1), true);

  progress.unlockAll = true;
  assert.equal(store.isUnlocked(progress, list, 1), true);
});

test("the weakest keys are ranked by miss rate and need enough data", () => {
  const progress = plain(store.defaultProgress());
  progress.keyStats = {
    a: { hits: 10, misses: 10 },
    b: { hits: 10, misses: 1 },
    c: { hits: 1, misses: 1 }
  };
  const weak = store.weakestKeys(progress, 6);
  assert.equal(weak[0].key, "a");
  assert.ok(!weak.some((entry) => entry.key === "c"), "a key with two samples is not meaningful yet");
});

test("accuracy and speed are computed the way the results screen shows them", () => {
  assert.equal(store.computeAccuracy(0, 0), 100);
  assert.equal(store.computeAccuracy(9, 10), 90);
  assert.equal(store.computeWpm(0, 0), 0);
  assert.equal(store.computeWpm(300, 60000), 60);
});
