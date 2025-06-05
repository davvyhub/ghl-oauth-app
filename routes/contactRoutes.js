const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// API Endpoint
router.get('/', contactController.getContacts);

router.get('/contacts', contactController.getContacts);

// Dashboard UI
router.get('/dashboard', contactController.renderContactsPage);

module.exports = router;
