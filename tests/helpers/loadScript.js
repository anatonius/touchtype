// Loads the plugin's pure JavaScript scripts outside Quickshell.
//
// The scripts are plain JavaScript apart from the `.pragma library` pragma,
// which only the QML engine understands. Stripping the pragma and running
// the source in an isolated context gives the tests the same top-level
// declarations the shell would see.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");

function loadScript(relativePath) {
  const file = path.resolve(ROOT, relativePath);
  const source = fs
    .readFileSync(file, "utf8")
    .replace(/^\s*\.pragma\s+library\s*$/m, "");
  const context = vm.createContext({ console });
  vm.runInContext(source, context, { filename: file });
  return context;
}

// Reads a repository file as text.
function readSource(relativePath) {
  return fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");
}

module.exports = { loadScript, readSource, ROOT };
