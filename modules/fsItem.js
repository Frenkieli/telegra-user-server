const fs = require("fs");

/**
 * @description 讀取 json
 *
 * @param {string} path file path
 * @return {*} 
 */
async function readFile(path) {
  return await fs.readFileSync(path, 'utf8');
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

/**
 * @description read folder file list
 *
 * @param {string} path folder path
 * @return {*} 
 */
async function getFolderList(path) {
  return await fs.readdirSync(path);
}

module.exports = {
  readFile,
  saveJson,
  getFolderList
};
