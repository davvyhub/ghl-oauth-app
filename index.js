// index.js

require('dotenv').config(); // Load variables from .env into process.env

const express = require('express');
const path = require('path');

const contactsRouter = require('./routes/contacts');

const app = express();

// Middleware to parse JSON bodies, if needed in the future
app.use(express.json());

// Mount the contacts router (handles /contacts/auth and /contacts/callback)
app.use('/contacts', contactsRouter);

// Simple health-check endpoint
app.get('/', (req, res) => {
  res.send('HighLevel Marketplace App Running');
});

// If no route matches, return 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server listening on port ${PORT}`);
});
