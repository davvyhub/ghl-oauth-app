const fs = require('fs');
const path = require('path');

const TOKENS_FILE = path.join(__dirname, '../tokens/tokens.json');
const LOCATION_TOKENS_FILE = path.join(__dirname, '../tokens/location_tokens.json');

function saveTokens(tokens) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) {
    return null;
  }

  const data = fs.readFileSync(TOKENS_FILE);
  return JSON.parse(data);
}

function saveLocationToken(locationId, tokenData) {
  let locationTokens = {};

  if (fs.existsSync(LOCATION_TOKENS_FILE)) {
    locationTokens = JSON.parse(fs.readFileSync(LOCATION_TOKENS_FILE));
  }

  locationTokens[locationId] = tokenData;
  fs.writeFileSync(LOCATION_TOKENS_FILE, JSON.stringify(locationTokens, null, 2));
}

function getLocationToken(locationId) {
  if (!fs.existsSync(LOCATION_TOKENS_FILE)) {
    return null;
  }

  const locationTokens = JSON.parse(fs.readFileSync(LOCATION_TOKENS_FILE));
  return locationTokens[locationId] || null;
}

module.exports = {
  saveTokens,
  getTokens,
  saveLocationToken,
  getLocationToken
};
