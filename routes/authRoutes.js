const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Step 1: Redirect user to GHL OAuth URL
router.get('/auth', authController.initiateOAuth);

// Step 2: Handle GHL redirect with code
router.get('/callback', authController.handleCallback);

module.exports = router;
