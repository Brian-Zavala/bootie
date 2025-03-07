// server/src/controllers/auth.js
const { validationResult } = require('express-validator');
const User = require('../models/User');
const authService = require('../services/auth');

// Register new user
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed in the pre-save hook
      firstName,
      lastName
    });
    
    await user.save();
    
    // Generate tokens and set cookies
    const { accessToken, refreshToken } = authService.generateTokens(user._id);
    authService.setAuthCookies(res, accessToken, refreshToken);
    
    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;
    
    res.status(201).json({
      message: 'Registration successful',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last active
    user.lastActive = Date.now();
    await user.save();
    
    // Generate tokens and set cookies
    const { accessToken, refreshToken } = authService.generateTokens(user._id);
    authService.setAuthCookies(res, accessToken, refreshToken);
    
    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;
    
    res.json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  authService.clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    
    // Refresh the token
    const tokens = await authService.refreshAccessToken(refreshToken);
    
    if (!tokens) {
      authService.clearAuthCookies(res);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Set new tokens as cookies
    authService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    
    // Find and return user
    const user = await User.findById(authService.verifyToken(tokens.accessToken).userId).select('-password');
    
    res.json({ message: 'Token refreshed', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};