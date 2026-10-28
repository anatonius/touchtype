const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScript, readSource } = require("./helpers/loadScript.js");

const i18n = loadScript("I18n.js");

const plain = (value) => JSON.parse(JSON.stringify(value));

const locales = plain(i18n.languages()).map((l) => l.id);
const qmlSources = ["TouchType.qml", "BarWidget.qml", "Keyboard.qml", "LanguageButton.qml"];

// Catalog keys are dotted and namespaced, which is what distinguishes them
// from the other string literals in the sources.
const KEY_PATTERN = /^(app|menu|lesson|results|admin|bar|finger|level)\.[A-Za-z]+(\.[A-Za-z]+)*$/;

function catalogKeysIn(source) {
  const found = new Set();
  // Single-line, unescaped literals only: a naive quote pairing would pair
  // quotes across lines and swallow the literals in between.
  for (const match of source.matchAll(/"([^"\\\n]+)"/g)) {
    if (KEY_PATTERN.test(match[1])) found.add(match[1]);
  }
  return found;
}

function referencedKeys() {
  const found = new Set();
  for (const file of qmlSources) {
    for (const key of catalogKeysIn(readSource(file))) found.add(key);
  }
  for (const key of catalogKeysIn(readSource("Curriculum.js"))) found.add(key);
  return found;
}

test("every supported locale defines the same set of keys", () => {
  const sets = locales.map((locale) => Object.keys(plain(i18n.strings(locale))).sort());
  for (let i = 1; i < sets.length; i++) {
    assert.deepEqual(sets[i], sets[0], `locale ${locales[i]} does not match ${locales[0]}`);
  }
});

test("every locale defines a non-empty catalog", () => {
  for (const locale of locales) {
    assert.ok(Object.keys(plain(i18n.strings(locale))).length > 0, `${locale} has no strings`);
  }
});

test("every key referenced by the screens and the curriculum exists", () => {
  const referenced = referencedKeys();
  assert.ok(referenced.size > 0, "no catalog keys were found in the sources");
  for (const locale of locales) {
    for (const key of referenced) {
      assert.notEqual(i18n.t(key, locale), key, `${key} is missing from ${locale}`);
    }
  }
});

test("no key referenced by the sources is left undefined", () => {
  for (const key of referencedKeys()) {
    for (const locale of locales) {
      const value = i18n.t(key, locale);
      assert.ok(value.length > 0, `${key} is empty in ${locale}`);
    }
  }
});

test("the English catalog holds every key the sources reference", () => {
  const english = Object.keys(plain(i18n.strings("en")));
  for (const key of referencedKeys()) {
    assert.ok(english.includes(key), `${key} is missing from the English catalog`);
  }
});

test("the Chinese catalog holds every key the sources reference", () => {
  const chinese = Object.keys(plain(i18n.strings("zh-CN")));
  for (const key of referencedKeys()) {
    assert.ok(chinese.includes(key), `${key} is missing from the Chinese catalog`);
  }
});

test("the catalog holds no key the sources never use", () => {
  const referenced = referencedKeys();
  for (const key of i18n.keys()) {
    assert.ok(referenced.has(key), `${key} is not referenced by any screen`);
  }
});
