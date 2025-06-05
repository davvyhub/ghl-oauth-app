const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Redirects user to GHL authorization screen
router.get('/auth', authController.startAuth);

// Handles the OAuth callback from GHL
router.get('/callback', authController.handleCallback);

module.exports = router;
