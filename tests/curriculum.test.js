const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScript } = require("./helpers/loadScript.js");

const curriculum = loadScript("Curriculum.js");
const corpus = loadScript("Corpus.js");

const plain = (value) => JSON.parse(JSON.stringify(value));

const levels = plain(curriculum.levels(corpus.punctuationChars));
const fingerLevels = plain(curriculum.fingerLevels());

// A deterministic generator keeps the drill assertions stable.
function seededRng(seed) {
  let state = seed >>> 0;
  return function () {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("every classic level carries the fields the screens read", () => {
  for (const level of levels) {
    assert.equal(typeof level.id, "string", "a level needs an id");
    assert.equal(typeof level.title, "string", `${level.id} needs a title`);
    assert.equal(typeof level.subtitle, "string", `${level.id} needs a subtitle`);
    assert.ok(["chars", "words", "mixed", "sentences"].includes(level.mode), `${level.id} has an unknown mode`);
    assert.equal(typeof level.passAccuracy, "number", `${level.id} needs a pass accuracy`);
    assert.equal(typeof level.passWpm, "number", `${level.id} needs a pass speed`);
  }
});

test("level ids are unique across both tracks", () => {
  const ids = levels.map((level) => level.id).concat(fingerLevels.map((level) => level.id));
  assert.equal(new Set(ids).size, ids.length, "two levels share an id");
});

test("the finger track is namespaced so it cannot collide with progress", () => {
  for (const level of fingerLevels) {
    assert.ok(level.id.startsWith("finger-"), `${level.id} should be namespaced with finger-`);
    assert.equal(level.track, "finger", `${level.id} should belong to the finger track`);
  }
});

test("finger levels drill only the keys of their own finger", () => {
  for (const level of fingerLevels) {
    if (!level.finger) continue;
    for (const key of level.keys) {
      assert.equal(curriculum.fingerForKey(key), level.finger, `${key} does not belong to the ${level.finger} finger`);
    }
  }
});

test("the home row maps to the fingers it is taught with", () => {
  assert.equal(curriculum.fingerForKey("f"), "index");
  assert.equal(curriculum.fingerForKey("j"), "index");
  assert.equal(curriculum.fingerForKey("d"), "middle");
  assert.equal(curriculum.fingerForKey("k"), "middle");
  assert.equal(curriculum.fingerForKey("s"), "ring");
  assert.equal(curriculum.fingerForKey("l"), "ring");
  assert.equal(curriculum.fingerForKey("a"), "pinky");
  assert.equal(curriculum.fingerForKey(";"), "pinky");
});

test("a chars drill reaches the length its level asks for", () => {
  const level = levels.find((candidate) => candidate.id === "homerow");
  const drill = curriculum.buildDrill(level, seededRng(7));
  assert.equal(typeof drill, "string");
  assert.ok(drill.length >= level.length, `drill was ${drill.length} chars, wanted ${level.length}`);
  assert.ok(!drill.includes("undefined"), "the drill leaked an undefined");
});

test("a words drill draws the word count its level asks for", () => {
  const level = levels.find((candidate) => candidate.id === "homerow-words");
  const drill = curriculum.buildDrill(level, seededRng(11), corpus.wordList);
  const words = drill.split(" ").filter(Boolean);
  assert.equal(words.length, level.count);
});
