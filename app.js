const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const CLIENT_ID = process.env.GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Step 1: Redirect user to GHL Authorization page
app.get('/auth', (req, res) => {
  const authUrl = `https://app.gohighlevel.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=contacts.read contacts.write`;
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for tokens
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) return res.send('No code found.');

  try {
    const tokenRes = await axios.post('https://api.gohighlevel.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    });

    fs.writeFileSync('tokens.json', JSON.stringify(tokenRes.data, null, 2));
    res.send('✅ Tokens received and saved!');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send('❌ Failed to exchange token.');
  }
});

// Step 3: Use access token to fetch contacts
app.get('/contacts', async (req, res) => {
  const tokens = JSON.parse(fs.readFileSync('tokens.json'));
  const accessToken = tokens.access_token;

  try {
    const contactRes = await axios.get('https://api.gohighlevel.com/v1/contacts/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(contactRes.data.contacts || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send('❌ Failed to fetch contacts.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`🔗 Visit http://localhost:${PORT}/auth to begin OAuth flow`);
});
