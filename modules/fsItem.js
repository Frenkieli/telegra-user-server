const fs = require("fs");

/**
 * @description 讀取 json
 *
 * @param {string} path file path
 * @return {*} 
 */
async function readJson(path) {
  return await fs.readFileSync(path);
}

/**
 * @description 儲存 json
 *
 * @param {string} path file path
 * @param {*} json json format
 * @return {*} 
 */
async function saveJson(path, json) {
  return await fs.writeFileSync(path, JSON.stringify(json));
}

module.exports = {
  readJson,
  saveJson,
};
