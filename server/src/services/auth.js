// server/src/services/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT tokens
 * @param {Object} payload - Data to encode in token
 * @returns {Object} Access and refresh tokens
 */
const generateTokens = (userId) => {
  // Access token expires in 1 hour
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Refresh token expires in 7 days
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    accessToken,
    refreshToken
  };
};

/**
 * Set authentication cookies
 * @param {Object} res - Express response object
 * @param {String} accessToken - JWT access token
 * @param {String} refreshToken - JWT refresh token
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  // Access token cookie - shorter lived, HttpOnly for security
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  });
  
  // Refresh token cookie - longer lived, HttpOnly for security
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/**
 * Clear authentication cookies
 * @param {Object} res - Express response object
 */
const clearAuthCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

/**
 * Verify and decode JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object|null} Decoded token or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Refresh access token using refresh token
 * @param {String} refreshToken - JWT refresh token
 * @returns {Object|null} New tokens or null if invalid
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) return null;
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) return null;
    
    // Generate new tokens
    return generateTokens(user._id);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  setAuthCookies,
  clearAuthCookies,
  verifyToken,
  refreshAccessToken
};