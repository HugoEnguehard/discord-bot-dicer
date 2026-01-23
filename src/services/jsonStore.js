const fs = require("node:fs");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

module.exports = { loadJson };
