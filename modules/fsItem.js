const fs = require("fs");

async function readJson (path) {
  return await fs.readFileSync(path);
}

async function saveJson (path, json) {
  return await fs.writeFileSync(path, JSON.stringify(json));
}

module.exports = {
  readJson,
  saveJson
}