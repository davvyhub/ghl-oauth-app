const axios = require('axios');
const qs = require('qs');
const logger = require('../utils/logger');
const tokenStore = require('../utils/tokenStore');

const {
  GHL_CLIENT_ID,
  GHL_CLIENT_SECRET,
  REDIRECT_URI,
  GHL_APP_ID,
} = process.env;

const BASE_URL = 'https://services.leadconnectorhq.com';

exports.exchangeToken = async (code) => {
  try {
    const payload = qs.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: GHL_CLIENT_ID,
      client_secret: GHL_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI
    });

    const response = await axios.post(`${BASE_URL}/oauth/token`, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (err) {
    logger.error('❌ Token exchange failed:', err.response?.data || err.message);
    throw new Error('Failed to exchange token');
  }
};

exports.getInstalledLocations = async (companyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/oauth/installedLocations`, {
      headers: {
        Version: '2021-07-28'
      },
      params: {
        companyId,
        appId: GHL_APP_ID,
        isInstalled: true
      }
    });

    return response.data.locations || [];
  } catch (err) {
    logger.error('❌ Failed to fetch installed locations:', err.response?.data || err.message);
    return [];
  }
};

exports.getLocationAccessToken = async (companyId, locationId) => {
  try {
    const payload = qs.stringify({
      companyId,
      locationId
    });

    const response = await axios.post(`${BASE_URL}/oauth/locationToken`, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Version': '2021-07-28'
      }
    });

    return response.data;
  } catch (err) {
    logger.error('❌ Failed to get location token:', err.response?.data || err.message);
    throw new Error('Failed to get location access token');
  }
};

exports.getContacts = async (accessToken) => {
  try {
    const response = await axios.get('https://services.leadconnectorhq.com/contacts/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data.contacts || [];
  } catch (err) {
    logger.error('❌ Failed to fetch contacts:', err.response?.data || err.message);
    throw new Error('Could not fetch contacts');
  }
};

exports.fetchContacts = async () => {
    try {
      const agencyTokens = tokenStore.getTokens(); // Contains agency/company token
      const { access_token, companyId, userId } = agencyTokens;
  
      // Step 1: Get installed locations
      const locationsRes = await axios.get(`${BASE_URL}/oauth/installedLocations`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Version: '2021-07-28',
        },
        params: {
          appId: process.env.GHL_APP_ID,
          companyId: companyId,
          isInstalled: true,
        },
      });
  
      const installedLocations = locationsRes.data.locations || [];
      const allContacts = [];
  
      for (const loc of installedLocations) {
        try {
          // Step 2: Get location-level token
          const locationTokenRes = await axios.post(`${BASE_URL}/oauth/locationToken`, null, {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              Version: '2021-07-28',
            },
            params: {
              companyId: companyId,
              locationId: loc._id,
            },
          });
  
          const locationToken = locationTokenRes.data.access_token;
  
          // Step 3: Fetch contacts from that location
          const contactsRes = await axios.get(`${BASE_URL}/contacts/`, {
            headers: {
              Authorization: `Bearer ${locationToken}`,
              Version: '2021-07-28',
              'Content-Type': 'application/json',
            },
            params: {
              locationId: loc._id,
              limit: 25,
            },
          });
  
          const contacts = contactsRes.data.contacts || [];
          allContacts.push(...contacts.map(c => ({ ...c, locationName: loc.name })));
  
        } catch (err) {
          console.error(`⚠️ Skipped location ${loc.name}:`, err.response?.data || err.message);
        }
      }
  
      return allContacts;
    } catch (error) {
      console.error('❌ Failed to fetch contacts:', error.response?.data || error.message);
      throw error;
    }
  };