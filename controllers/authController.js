const axios = require('axios');
const tokenStore = require('../utils/tokenStore');
require('dotenv').config();

const {
  GHL_CLIENT_ID,
  GHL_CLIENT_SECRET,
  REDIRECT_URI,
  GHL_SCOPES,
} = process.env;

exports.startAuth = (req, res) => {
  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${GHL_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(GHL_SCOPES)}`;
  res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('❌ No authorization code provided');
  }

  try {
    const tokenRes = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: GHL_CLIENT_ID,
        client_secret: GHL_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    await tokenStore.saveTokens(tokenRes.data);
    res.send('✅ Tokens received and saved!');
  } catch (err) {
    console.error('❌ Token exchange failed:', err.response?.data || err.message);
    res.status(500).send('❌ Failed to exchange token.');
  }
};
