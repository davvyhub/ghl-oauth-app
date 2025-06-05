const axios = require('axios');
const querystring = require('querystring');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_BASE_URL = process.env.AUTH_BASE_URL;
const API_BASE_URL = process.env.API_BASE_URL;

exports.initiateOAuth = (req, res) => {
  const scopes = [
    'contacts.readonly',
    'contacts.write',
    'locations.readonly',
  ].join(' ');

  const url = `${AUTH_BASE_URL}/oauth/chooselocation?` + querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: scopes,
  });

  res.redirect(url);
};

exports.handleCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const tokenResponse = await axios.post(`${API_BASE_URL}/oauth/token`, querystring.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokens = tokenResponse.data;

    console.log('✅ Tokens received:', tokens);
    res.json(tokens); // For testing, respond with the tokens
  } catch (error) {
    console.error('❌ Error exchanging token:', error.response?.data || error.message);
    res.status(500).send('Token exchange failed');
  }
};
