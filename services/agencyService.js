// services/agencyService.js

const axios = require('axios');

const INSTALLED_LOCATIONS_URL = 'https://services.leadconnectorhq.com/oauth/installedLocations';

module.exports = {
  /**
   * Fetch all sub-account (location) IDs where the app is installed for a given agency.
   * @param {Object} params
   * @param {string} params.agencyToken – the agency-level access_token
   * @param {string} params.companyId    – the agency’s company ID (process.env.GHL_COMPANY_ID)
   * @returns {Promise<string[]>} an array of location IDs
   */
  async getInstalledLocations({ agencyToken, companyId }) {
    const response = await axios.get(INSTALLED_LOCATIONS_URL, {
      headers: {
        Authorization: `Bearer ${agencyToken}`,
        Accept: 'application/json',
        Version: '2021-07-28',
      },
      params: {
        companyId: companyId,
        appId: process.env.GHL_APP_ID,
        // you can add optional filters here (skip, limit, onTrial, etc.)
      },
    });

    // API returns { locations: [ { id, name, … }, … ], count, installToFutureLocations }
    // We only need the array of IDs:
    const locations = response.data.locations || [];
    return locations.map(loc => loc.id);
  },
};
