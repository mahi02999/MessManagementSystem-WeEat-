// backend/routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get('/calculatePrice/:stud_id', priceController.calculatePrice);

module.exports = router;
