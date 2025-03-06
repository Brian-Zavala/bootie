// server/src/routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validate registration input
const validateRegistration = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validate login input
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Registration route
router.post('/register', validateRegistration, AuthController.register);

// Login route
router.post('/login', validateLogin, AuthController.login);

// Logout route
router.post('/logout', AuthController.logout);

// Get current user
router.get('/me', authenticate, AuthController.getCurrentUser);

// Refresh token
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;