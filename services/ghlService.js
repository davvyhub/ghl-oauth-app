const axios = require('axios');
const tokenStore = require('../utils/tokenStore');

const API_BASE_URL = process.env.API_BASE_URL;

// Fetch user profile (optional, for testing token)
async function getUserInfo(accessToken) {
  const res = await axios.get(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}

// Fetch contacts for a given location
async function fetchContacts(accessToken) {
  try {
    const response = await axios.get(`${API_BASE_URL}/contacts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error('❌ Failed to fetch contacts:', err.response?.data || err.message);
    return null;
  }
}

// Get installed locations for a company
async function getInstalledLocations(companyId) {
  const tokens = await tokenStore.loadTokens(); // fixed from getTokens to loadTokens

  const url = `${API_BASE_URL}/oauth/installedLocations?companyId=${companyId}&appId=${process.env.GHL_APP_ID}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      Version: '2021-07-28'
    }
  });

  return response.data.locations;
}

module.exports = {
  getUserInfo,
  fetchContacts,
  getInstalledLocations,
};
