const express = require('express');
const router = express.Router();
const messController = require('../controllers/messController');

// Route to handle mess registration
router.post('/register', messController.registerMess);

// Route to handle mess login
router.post('/login', messController.loginMess);

module.exports = router;
