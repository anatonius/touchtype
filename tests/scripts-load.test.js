const test = require("node:test");
const assert = require("node:assert/strict");
const { loadScript } = require("./helpers/loadScript.js");

// The pure scripts are shared by the shell and the tests; this guards
// against a script that only loads inside Quickshell.
const scripts = [
  ["Corpus.js", ["wordList"]],
  ["Curriculum.js", ["levels", "fingerLevels", "buildDrill", "fingerForKey"]],
  ["ProgressStore.js", ["defaultProgress", "parse", "toJsonText", "recordAttempt"]],
  ["I18n.js", ["languages", "t", "normalize"]]
];

for (const [file, expected] of scripts) {
  test(`${file} loads outside Quickshell and exposes its functions`, () => {
    const script = loadScript(file);
    for (const name of expected) {
      assert.equal(typeof script[name], "function", `${file} should export ${name}`);
    }
  });
}

test("Corpus.js exposes its data banks", () => {
  const corpus = loadScript("Corpus.js");
  assert.ok(Array.isArray(corpus.punctuationChars));
  assert.ok(Array.isArray(corpus.sentences));
  assert.ok(corpus.wordList("homeRow").length > 0);
});
