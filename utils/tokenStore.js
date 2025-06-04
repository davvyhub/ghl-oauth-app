const fs = require('fs');
const path = require('path');

const TOKEN_FILE = process.env.TOKEN_FILE || './tokens/tokens.json';

exports.saveTokens = async (tokens) => {
  const dir = path.dirname(TOKEN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
};

exports.loadTokens = async () => {
  if (!fs.existsSync(TOKEN_FILE)) throw new Error('No token file found.');
  return JSON.parse(fs.readFileSync(TOKEN_FILE));
};
