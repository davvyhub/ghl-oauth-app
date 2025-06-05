const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../tokens/tokens.json');

let storedLocationTokens = {}; // { [locationId]: accessToken }

function saveTokens(data) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(data, null, 2));
}

function loadTokens() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const content = fs.readFileSync(TOKEN_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveLocationToken(locationId, token) {
  storedLocationTokens[locationId] = token.access_token;
}

function getAllLocationTokens() {
  return storedLocationTokens;
}

module.exports = {
  saveTokens,
  loadTokens,
  saveLocationToken,
  getAllLocationTokens,
};
