// backend/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Route to add a menu item
router.post('/addMenu', menuController.addMenu);
router.get('/messDetails', menuController.getMessDetails);

module.exports = router;
