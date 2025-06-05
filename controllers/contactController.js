const ghlService = require('../services/ghlService');
const tokenStore = require('../utils/tokenStore');

exports.getContacts = async (req, res) => {
  try {
    // Retrieve stored tokens
    const allTokens = await tokenStore.getAllLocationTokens();

    let allContacts = [];

    for (const locationId in allTokens) {
      const token = allTokens[locationId];

      const contacts = await ghlService.fetchContacts(token.access_token);
      allContacts = allContacts.concat(contacts);
    }

    res.render('dashboard', { contacts: allContacts });
  } catch (error) {
    console.error('❌ Failed to fetch contacts:', error.message || error);
    res.render('dashboard', { contacts: [] });
  }
};
