// controllers/contactController.js
const ghlService = require('../services/ghlService');
const tokenStore = require('../utils/tokenStore');

exports.showContacts = async (req, res) => {
  try {
    const locationTokens = await tokenStore.getAllLocationTokens();

    let allContacts = [];

    for (const [locationId, accessToken] of Object.entries(locationTokens)) {
      const contacts = await ghlService.fetchContacts(accessToken, locationId);
      allContacts.push(...contacts);
    }

    res.render('dashboard', { contacts: allContacts });
  } catch (error) {
    console.error('❌ Failed to load contacts:', error.message || error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
  }
};
