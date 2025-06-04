const axios = require('axios');
const tokenStore = require('../utils/tokenStore');
const logger = require('../utils/logger');

const GHL_API_BASE = 'https://api.gohighlevel.com/v1';

exports.refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${GHL_API_BASE}/oauth/token`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
    });

    await tokenStore.saveTokens(response.data);
    logger.success('🔁 Access token refreshed.');
    return response.data.access_token;
  } catch (error) {
    logger.error('❌ Failed to refresh token:', error.response?.data || error.message);
    throw error;
  }
};

exports.getContacts = async () => {
  const tokens = await tokenStore.loadTokens();
  let accessToken = tokens.access_token;

  try {
    const response = await axios.get(`${GHL_API_BASE}/contacts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.contacts || [];
  } catch (err) {
    if (err.response?.status === 401 && tokens.refresh_token) {
      logger.warn('⚠️ Token expired. Refreshing...');
      accessToken = await exports.refreshAccessToken(tokens.refresh_token);

      // Retry once
      const retryRes = await axios.get(`${GHL_API_BASE}/contacts/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return retryRes.data.contacts || [];
    } else {
      logger.error('❌ Failed to fetch contacts:', err.response?.data || err.message);
      throw err;
    }
  }
};
