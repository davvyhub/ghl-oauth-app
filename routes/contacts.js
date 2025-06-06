const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const path = require('path');

const authService = require('../services/authService');
const agencyService = require('../services/agencyService');
const tokenService = require('../services/tokenService');
const contactService = require('../services/contactService');
const fileStorage = require('../utils/fileStorage');

// 1) Redirect user to HighLevel's OAuth consent page
router.get('/auth', (req, res) => {
  const params = {
    response_type: 'code',
    client_id: process.env.GHL_CLIENT_ID,
    redirect_uri: process.env.GHL_REDIRECT_URI,
    scope: process.env.GHL_SCOPES || 'contacts.readonly',
  };

  const authUrl =
    'https://marketplace.gohighlevel.com/oauth/chooselocation?' +
    querystring.stringify(params);

  res.redirect(authUrl);
});

// 2) Handle OAuth callback and fetch all contacts
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code.' });
    }

    // a) Exchange code for agency access token
    const { access_token: agencyToken } = await authService.exchangeCodeForToken(code);

    // b) Fetch all installed sub-accounts (locations) for the agency
    const installedLocations = await agencyService.getInstalledLocations({
      agencyToken,
      companyId: process.env.GHL_COMPANY_ID,
    });

    const allContacts = [];

    // c) For each location, fetch contacts
    for (let location of installedLocations) {
      const locationId = location.id;
      const businessId = location.businessId;

      // i) Convert agency token to location-level token
      const { access_token: locationToken } = await tokenService.getLocationToken({
        agencyToken,
        companyId: process.env.GHL_COMPANY_ID,
        locationId,
      });

      // ii) Fetch contacts from that location
      const contacts = await contactService.getContactsByBusinessId({
        locationToken,
        locationId,
        businessId,
      });

      // iii) Aggregate them
      allContacts.push(...contacts);
    }

    // d) Save all contacts to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'contacts.json');
    await fileStorage.writeJson(outputPath, allContacts);

    // e) Done!
    return res.json({
      success: true,
      totalFetched: allContacts.length,
    });
  } catch (err) {
    console.error('Error in /contacts/callback:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'An error occurred while fetching contacts.' });
  }
});

module.exports = router;
