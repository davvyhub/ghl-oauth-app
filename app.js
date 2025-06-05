const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the GoHighLevel OAuth App!');
});

app.get('/callback', (req, res) => {
    res.redirect(`/auth/callback${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`);
  });
  
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
