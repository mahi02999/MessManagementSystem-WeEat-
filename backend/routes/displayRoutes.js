// backend/routes/displayRoutes.js
const express = require('express');
const router = express.Router();
const displayController = require('../controllers/displayController');

router.get('/menu', displayController.getMenu);

module.exports = router;
