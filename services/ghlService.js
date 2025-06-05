const axios = require('axios');
const tokenStore = require('../utils/tokenStore');

const API_BASE_URL = process.env.API_BASE_URL;

// Fetch user profile (optional, to test token)
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

module.exports = {
  getUserInfo,
  fetchContacts,
};
