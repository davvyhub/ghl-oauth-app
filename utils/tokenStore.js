const fs = require('fs');
const path = require('path');
const tokenPath = path.join(__dirname, '../tokens/tokens.json');

exports.saveTokens = (tokens) => {
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
};

exports.loadTokens = () => {
  if (!fs.existsSync(tokenPath)) {
    console.error('❌ No token file found.');
    return null;
  }
  const raw = fs.readFileSync(tokenPath);
  return JSON.parse(raw);
};
