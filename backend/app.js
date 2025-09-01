// backend/app.js
const express = require('express');
const session = require('express-session'); // Import session middleware
const path = require('path');
const app = express();

const menuRoutes = require('./routes/menuRoutes');
const messRoutes = require('./routes/messRoutes');
const studentRoutes = require('./routes/studentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const displayRoutes = require('./routes/displayRoutes');
const priceRoutes = require('./routes/priceRoutes'); // Price routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a secure key for production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use('/menu', menuRoutes);
app.use('/mess', messRoutes);
app.use('/student', studentRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/display', displayRoutes);
app.use('/price', priceRoutes); // Route for price calculation

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
