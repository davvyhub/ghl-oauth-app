const ghlService = require('../services/ghlService');
const logger = require('../utils/logger');
const tokenStore = require('../utils/tokenStore');

exports.getContacts = async (req, res) => {
    try {
      // For simplicity, fetch all location tokens and use the first one
      const agencyTokens = tokenStore.getTokens();
  
      if (!agencyTokens || !agencyTokens.approvedLocations || agencyTokens.approvedLocations.length === 0) {
        return res.status(400).json({ success: false, message: 'No locations found. Please authorize with at least one location.' });
      }
  
      const locationId = agencyTokens.approvedLocations[0];
      const locationToken = tokenStore.getLocationToken(locationId);
  
      if (!locationToken || !locationToken.access_token) {
        return res.status(400).json({ success: false, message: 'No access token found for the selected location.' });
      }
  
      const contacts = await ghlService.fetchContacts(locationToken.access_token, locationId);
      res.render('dashboard', { contacts });
    } catch (error) {
      console.error('❌ Error in renderContactsPage:', error.message || error);
      res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
    }
  };

  /**
   * Renders contacts from multiple locations in the dashboard
   */
  exports.renderContactsPage = async (req, res) => {
    try {
      const contacts = await ghlService.fetchContacts();
      res.render('dashboard', { contacts });
    } catch (error) {
      console.error('❌ Error in renderContactsPage:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
    }
  };
  