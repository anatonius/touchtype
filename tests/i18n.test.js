const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScript } = require("./helpers/loadScript.js");

const i18n = loadScript("I18n.js");

// Values produced inside the script realm have that realm's prototypes, so
// structural comparisons go through JSON to compare plain data.
const plain = (value) => JSON.parse(JSON.stringify(value));

test("languages lists the supported locales in switch order", () => {
  const ids = plain(i18n.languages()).map((l) => l.id);
  assert.deepEqual(ids, ["en", "zh-CN"]);
  assert.equal(i18n.languages()[0].label, "English");
  assert.equal(i18n.languages()[1].label, "简体中文");
});

test("default language is English", () => {
  assert.equal(i18n.defaultLanguage(), "en");
});

test("isLanguage recognises supported locales only", () => {
  assert.equal(i18n.isLanguage("en"), true);
  assert.equal(i18n.isLanguage("zh-CN"), true);
  assert.equal(i18n.isLanguage("zh"), false);
  assert.equal(i18n.isLanguage(""), false);
  assert.equal(i18n.isLanguage(undefined), false);
});

test("normalize maps unknown locales onto the default", () => {
  assert.equal(i18n.normalize("zh-CN"), "zh-CN");
  assert.equal(i18n.normalize("fr"), "en");
  assert.equal(i18n.normalize(""), "en");
  assert.equal(i18n.normalize(undefined), "en");
  assert.equal(i18n.normalize(null), "en");
});

test("nextLanguage cycles through the locales", () => {
  assert.equal(i18n.nextLanguage("en"), "zh-CN");
  assert.equal(i18n.nextLanguage("zh-CN"), "en");
});

test("nextLanguage treats an unknown id as the default locale", () => {
  assert.equal(i18n.nextLanguage("fr"), i18n.nextLanguage("en"));
});

test("label returns the locale's own name", () => {
  assert.equal(i18n.label("en"), "English");
  assert.equal(i18n.label("zh-CN"), "简体中文");
  assert.equal(i18n.label("fr"), "");
});

test("t resolves a key for a locale", () => {
  assert.equal(i18n.t("app.title", "en"), "Touch Type");
  assert.equal(i18n.t("app.title", "zh-CN"), "盲打练习");
});

test("t falls back to English for a key the locale has not translated", () => {
  const saved = i18n.strings("zh-CN")["app.title"];
  assert.equal(typeof saved, "string");
  assert.equal(i18n.t("does.not.exist", "zh-CN"), "does.not.exist");
  assert.equal(i18n.t("app.title", "fr"), "Touch Type");
});

test("t returns the key itself when no locale defines it", () => {
  assert.equal(i18n.t("no.such.key", "en"), "no.such.key");
  assert.equal(i18n.t("no.such.key", "zh-CN"), "no.such.key");
});

test("t returns an empty string for an empty key", () => {
  assert.equal(i18n.t("", "en"), "");
  assert.equal(i18n.t(undefined, "en"), "");
});

test("t substitutes placeholders", () => {
  assert.equal(i18n.t("app.streak", "en", { n: 3 }), "3 day streak");
  assert.equal(i18n.t("app.streak", "zh-CN", { n: 3 }), "连续练习 3 天");
});

test("t substitutes every occurrence of a placeholder", () => {
  assert.equal(i18n.t("menu.level.best", "en", { wpm: 42, acc: 96 }), "Best: 42 wpm · 96%");
});

test("t leaves unknown placeholders in place", () => {
  assert.equal(i18n.t("app.streak", "en", { other: 3 }), "{n} day streak");
});

test("t ignores null and undefined parameter values", () => {
  assert.equal(i18n.t("app.streak", "en", { n: null }), "{n} day streak");
  assert.equal(i18n.t("app.streak", "en", { n: undefined }), "{n} day streak");
});

test("strings returns an empty catalog for an unknown locale", () => {
  assert.deepEqual(plain(i18n.strings("fr")), {});
});

test("keys returns every key defined by any catalog", () => {
  const keys = plain(i18n.keys());
  assert.ok(Array.isArray(keys));
  assert.ok(keys.includes("app.title"));
  assert.ok(keys.includes("level.homerow.title"));
  assert.equal(new Set(keys).size, keys.length);
});

test("fontFamily picks a CJK-capable family for Chinese", () => {
  assert.equal(i18n.fontFamily("zh-CN", "Inter"), "Noto Sans CJK SC");
});

test("fontFamily falls back to the theme font elsewhere", () => {
  assert.equal(i18n.fontFamily("en", "Inter"), "Inter");
  assert.equal(i18n.fontFamily("fr", "Inter"), "Inter");
  assert.equal(i18n.fontFamily("en", ""), "");
});
