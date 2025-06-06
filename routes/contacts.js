// routes/contacts.js

const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const path = require('path');

const authService = require('../services/authService');
const agencyService = require('../services/agencyService');
const tokenService = require('../services/tokenService');
const contactService = require('../services/contactService');
const fileStorage = require('../utils/fileStorage');

// Load scopes (for reference) from config; actual values come from process.env
const config = require('../config/ghlConfig.json');

/**
 * 1) GET /contacts/auth
 *    Redirects the agency admin to HighLevel’s OAuth consent page.
 */
router.get('/auth', (req, res) => {
  const params = {
    response_type: 'code',
    client_id: process.env.GHL_CLIENT_ID,
    redirect_uri: process.env.GHL_REDIRECT_URI,
    scope: config.scopes,
  };
  const authUrl =
    'https://marketplace.gohighlevel.com/oauth/chooselocation?' +
    querystring.stringify(params);
  res.redirect(authUrl);
});

/**
 * 2) GET /contacts/callback
 *    Handles the OAuth callback:
 *      a) Exchanges code for agency access token
 *      b) Fetches all installed location IDs under this agency
 *      c) For each location:
 *           i) Converts agency token → location token
 *          ii) Fetches all contacts for that location
 *         iii) Aggregates contacts
 *      d) Writes the aggregated array to data/contacts.json
 *      e) Responds with a simple success JSON
 */
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code.' });
    }

    // 2.a Exchange code for agency token
    const { access_token: agencyToken } = await authService.exchangeCodeForToken(
      code
    );

    // 2.b Fetch all installed sub-account (location) IDs
    const installedLocations = await agencyService.getInstalledLocations({
      agencyToken,
      companyId: process.env.GHL_COMPANY_ID,
    });
    // installedLocations is an array of strings: [ 'locId1', 'locId2', ... ]

    const allContacts = [];

    // 2.c Loop through each locationId
    for (let locationId of installedLocations) {
      // 2.c.i Exchange agencyToken → locationToken
      const locationToken = await tokenService.getLocationToken({
        agencyToken,
        companyId: process.env.GHL_COMPANY_ID,
        locationId,
      });

      // 2.c.ii Fetch all contacts for this sub-account
      const contacts = await contactService.fetchContactsByBusinessId({
        locationToken,
        businessId: locationId,
        limit: 100,
        skip: 0,
      });

      // 2.c.iii Append to the master list
      allContacts.push(...contacts);
    }

    // 2.d Write allContacts to data/contacts.json
    const outputPath = path.join(__dirname, '..', 'data', 'contacts.json');
    await fileStorage.writeJson(outputPath, allContacts);

    // 2.e Respond with success
    return res.json({
      success: true,
      totalFetched: allContacts.length,
    });
  } catch (err) {
    console.error('Error in /contacts/callback:', err);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching contacts.' });
  }
});

module.exports = router;
