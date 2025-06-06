// utils/fileStorage.js

const fs = require('fs').promises;

/**
 * Read a JSON file and parse its contents.
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @returns {Promise<any>} - Parsed JavaScript object/array from the JSON file.
 */
async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If file does not exist, return an empty array/object as fallback
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

/**
 * Write a JavaScript object/array to a JSON file, overwriting any existing contents.
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @param {any} data - The object/array to serialize and write.
 * @returns {Promise<void>}
 */
async function writeJson(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, json, 'utf8');
  } catch (err) {
    throw err;
  }
}

module.exports = {
  readJson,
  writeJson,
};
