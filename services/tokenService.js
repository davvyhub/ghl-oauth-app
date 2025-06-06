// services/tokenService.js

const axios = require('axios');
const qs = require('qs');

const LOCATION_TOKEN_URL = 'https://services.leadconnectorhq.com/oauth/locationToken';

module.exports = {
  /**
   * Exchange an agency-level access token for a location-level access token.
   *
   * @param {Object} params
   * @param {string} params.agencyToken  – the agency-level access_token
   * @param {string} params.companyId    – the agency’s company ID
   * @param {string} params.locationId   – the sub-account (location) ID
   * @returns {Promise<string>} the location access_token
   */
  async getLocationToken({ agencyToken, companyId, locationId }) {
    const payload = qs.stringify({
      companyId: companyId,
      locationId: locationId,
      appId: process.env.GHL_CLIENT_ID, // ✅ Add this field
    });

    const response = await axios.post(LOCATION_TOKEN_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Bearer ${agencyToken}`,
        Version: '2021-07-28',
      },
    });

    return response.data.access_token;
  },
};
