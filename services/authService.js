// services/authService.js

const axios = require('axios');
const qs = require('qs');

const TOKEN_URL = 'https://services.leadconnectorhq.com/oauth/token';

module.exports = {
  /**
   * Exchange an authorization code for an agency access token + refresh token.
   * @param {string} code  – the OAuth2 authorization code from HighLevel
   * @returns {Promise<{ access_token: string, refresh_token: string, expires_in: number }>}
   */
  async exchangeCodeForToken(code) {
    const payload = qs.stringify({
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.GHL_REDIRECT_URI,
    });

    const response = await axios.post(TOKEN_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    // response.data contains: access_token, refresh_token, expires_in, etc.
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };
  },

  /**
   * Use a refresh token to get a new access_token + refresh_token.
   * @param {string} refreshToken
   * @returns {Promise<{ access_token: string, refresh_token: string, expires_in: number }>}
   */
  async refreshAgencyToken(refreshToken) {
    const payload = qs.stringify({
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await axios.post(TOKEN_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };
  },
};
