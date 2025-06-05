const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN_FILE = process.env.TOKEN_FILE || './tokens/tokens.json';

exports.redirectToAuth = (req, res) => {
  const authUrl = `https://app.gohighlevel.com/oauth/authorize?response_type=code&client_id=${process.env.GHL_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=contacts.read contacts.write`;
  res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send('No code received in callback.');

  try {
    const tokenResponse = await axios.post('https://api.gohighlevel.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
    });

    const dir = path.dirname(process.env.TOKEN_FILE || './tokens/tokens.json');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(process.env.TOKEN_FILE || './tokens/tokens.json', JSON.stringify(tokenResponse.data, null, 2));
    res.send('✅ Tokens received and saved!');
  } catch (err) {
    console.error('❌ Token exchange failed:', err.response?.data || err.message);
    res.status(500).send('❌ Failed to exchange token.');
  }
};
