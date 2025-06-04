const ghlService = require('../services/ghlService');
const logger = require('../utils/logger');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await ghlService.getContacts();
    res.json(contacts);
  } catch (err) {
    logger.error('Error in getContacts:', err.response?.data || err.message);
    res.status(500).send('❌ Failed to fetch contacts.');
  }
};

exports.renderContactsPage = async (req, res) => {
  try {
    const contacts = await ghlService.getContacts();
    res.render('dashboard', { contacts });
  } catch (err) {
    logger.error('Error in renderContactsPage:', err.response?.data || err.message);
    res.status(500).send('❌ Failed to render dashboard.');
  }
};
