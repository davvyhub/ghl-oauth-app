const axios = require('axios');
const tokenStore = require('../utils/tokenStore');

exports.fetchContacts = async () => {
  const tokens = tokenStore.loadTokens();
  const accessToken = tokens?.access_token;

  if (!accessToken) throw new Error('No access token found.');

  try {
    // Fetch locations first
    const userInfo = await axios.get('https://services.leadconnectorhq.com/v2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const locationId = userInfo?.data?.locationId;
    if (!locationId) throw new Error('No location ID found for user.');

    const res = await axios.get(`https://services.leadconnectorhq.com/v2/locations/${locationId}/contacts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.contacts || [];
  } catch (err) {
    console.error('❌ Failed to fetch contacts:', err?.response?.data || err.message);
    throw err;
  }
};
