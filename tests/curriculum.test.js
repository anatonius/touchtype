const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScript } = require("./helpers/loadScript.js");

const curriculum = loadScript("Curriculum.js");
const corpus = loadScript("Corpus.js");
const i18n = loadScript("I18n.js");

const plain = (value) => JSON.parse(JSON.stringify(value));

const levels = plain(curriculum.levels(corpus.punctuationChars));
const fingerLevels = plain(curriculum.fingerLevels());
const allLevels = levels.concat(fingerLevels);

const locales = plain(i18n.languages()).map((l) => l.id);

test("every level carries a title key and no literal title", () => {
  for (const level of allLevels) {
    assert.equal(typeof level.titleKey, "string", `${level.id} needs a titleKey`);
    assert.equal(level.title, undefined, `${level.id} should not carry a literal title`);
    assert.equal(level.subtitle, undefined, `${level.id} should not carry a literal subtitle`);
  }
});

test("every level has exactly one kind of description", () => {
  for (const level of allLevels) {
    const hasProse = typeof level.subtitleKey === "string";
    const hasHint = typeof level.keysHint === "string";
    assert.ok(hasProse !== hasHint, `${level.id} needs a subtitle key or a key hint, not both`);
  }
});

test("every level title resolves in every locale", () => {
  for (const level of allLevels) {
    for (const locale of locales) {
      const resolved = i18n.t(level.titleKey, locale);
      assert.notEqual(resolved, level.titleKey, `${level.id} title is missing in ${locale}`);
      assert.ok(resolved.length > 0);
    }
  }
});

test("every prose description resolves in every locale", () => {
  for (const level of allLevels) {
    if (!level.subtitleKey) continue;
    for (const locale of locales) {
      const resolved = i18n.t(level.subtitleKey, locale);
      assert.notEqual(resolved, level.subtitleKey, `${level.id} subtitle is missing in ${locale}`);
    }
  }
});

test("every finger label resolves in every locale", () => {
  for (const finger of Object.values(plain(curriculum.fingerMeta))) {
    for (const locale of locales) {
      const resolved = i18n.t(finger.labelKey, locale);
      assert.notEqual(resolved, finger.labelKey, `${finger.id} label is missing in ${locale}`);
    }
  }
});

test("key hints are language-neutral", () => {
  for (const level of allLevels) {
    if (!level.keysHint) continue;
    assert.ok(!/[a-z]/.test(level.keysHint), `${level.id} hint should not contain prose`);
    assert.ok(!/[一-鿿]/.test(level.keysHint), `${level.id} hint should not be translated`);
  }
});

test("character drills only use the level's own keys", () => {
  for (const level of levels.concat(fingerLevels)) {
    if (level.mode !== "chars") continue;
    const text = curriculum.buildDrill(level, Math.random, () => [], []);
    const allowed = level.keys.join("");
    for (const ch of text) {
      assert.ok(ch === " " || allowed.includes(ch), `${level.id} produced unexpected character "${ch}"`);
    }
  }
});

test("word drills draw from the named corpus bucket", () => {
  for (const level of levels) {
    if (level.mode !== "words") continue;
    const bucket = new Set(corpus.wordList(level.wordList));
    const text = curriculum.buildDrill(level, Math.random, (name) => corpus.wordList(name), corpus.sentences);
    for (const word of text.split(" ")) {
      assert.ok(bucket.has(word), `${level.id} produced unknown word "${word}"`);
    }
  }
});

test("sentence drills draw from the sentence pool", () => {
  for (const level of levels) {
    if (level.mode !== "sentences") continue;
    const pool = new Set(corpus.sentences);
    const text = curriculum.buildDrill(level, Math.random, () => [], corpus.sentences);
    for (const sentence of corpus.sentences) {
      if (text.includes(sentence)) assert.ok(pool.has(sentence));
    }
    assert.ok(text.length > 0);
  }
});

test("levels keep their identifiers, difficulty and unlock order", () => {
  assert.deepEqual(
    levels.map((l) => l.id),
    ["anchors", "homerow", "homerow-words", "toprow", "toprow-words", "bottomrow",
      "fullalphabet", "numbers", "mixed", "sentences"]
  );
  assert.deepEqual(
    fingerLevels.map((l) => l.id),
    ["finger-index", "finger-middle", "finger-ring", "finger-pinky", "finger-numbers", "finger-punct"]
  );
  for (const level of allLevels) {
    assert.ok(level.passAccuracy > 0 && level.passAccuracy <= 100);
    assert.ok(level.passWpm >= 0);
  }
});
