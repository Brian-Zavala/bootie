// server/src/middleware/auth.js
const User = require('../models/User');
const authService = require('../services/auth');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const accessToken = req.cookies.accessToken || 
                      (req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
                      ? req.headers.authorization.split(' ')[1] : null);
    
    if (!accessToken) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = authService.verifyToken(accessToken);
    
    if (!decoded) {
      // Try to refresh the token if a refresh token is available
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const tokens = await authService.refreshAccessToken(refreshToken);
      
      if (!tokens) {
        authService.clearAuthCookies(res);
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Set new tokens
      authService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      
      // Get user from new token
      const newDecoded = authService.verifyToken(tokens.accessToken);
      const user = await User.findById(newDecoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user;
      return next();
    }
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Middleware to authorize based on user roles
 * @param {Array} roles - Array of allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };