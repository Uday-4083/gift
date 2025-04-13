const express = require('express');
const router = express.Router();
const { login, signup, merchantSignup } = require('../controllers/authController');

// Regular user routes
router.post('/signup', signup);
router.post('/login', login);

// Merchant specific routes
router.post('/merchant/signup', merchantSignup);

module.exports = router; 