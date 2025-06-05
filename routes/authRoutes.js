const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Make sure each controller method exists and is a function
router.get('/auth', authController.startOAuth);
router.get('/callback', authController.handleCallback);

module.exports = router;
