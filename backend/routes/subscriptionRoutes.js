// backend/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to add a subscription
router.post('/addSubscription', subscriptionController.addSubscription);

module.exports = router;
