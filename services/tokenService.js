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
   * @param {string} params.companyId    – the agency’s company ID (process.env.GHL_COMPANY_ID)
   * @param {string} params.locationId   – the sub-account (location) ID
   * @returns {Promise<string>} the location access_token
   */
  async getLocationToken({ agencyToken, companyId, locationId }) {
    const payload = qs.stringify({
      companyId: companyId,
      locationId: locationId,
    });

    const response = await axios.post(LOCATION_TOKEN_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Bearer ${agencyToken}`,
        Version: '2021-07-28',
      },
    });

    // The response payload contains: access_token, token_type, expires_in, etc.
    return response.data.access_token;
  },
};
