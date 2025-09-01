const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route to handle student registration
router.post('/register', studentController.registerStudent);

// Route to handle student login
router.post('/login', studentController.loginStudent);

module.exports = router;
