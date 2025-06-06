// services/tokenService.js

const axios = require('axios');
const qs = require('qs');

const LOCATION_TOKEN_URL = 'https://services.leadconnectorhq.com/oauth/locationToken';

module.exports = {
  async getLocationToken({ agencyToken, companyId, locationId }) {
    const payload = qs.stringify({
      companyId: String(companyId),
      locationId: String(locationId),
      appId: String(process.env.GHL_CLIENT_ID),  // ✅ Force convert to string
    });

    const response = await axios.post(LOCATION_TOKEN_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Bearer ${agencyToken}`,
        Version: '2021-07-28',
      },
    });

    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    };
  },
};
