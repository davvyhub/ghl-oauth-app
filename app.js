require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/', authRoutes);
app.use('/', contactRoutes);

// Optional static folder for views or frontend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
