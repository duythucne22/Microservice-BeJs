const User = require('../models/userModels');
const Owner = require('../models/ownerModels');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtUtils');

// Store refresh tokens (in a real application, use Redis or a database)
const refreshTokens = new Set();

exports.login = async (req, res) => {
  try {
    const { userName, passWord, role } = req.body;
    
    let user;
    
    if (role === 'owner') {
      user = await Owner.validateCredentials(userName, passWord);
    } else {
      user = await User.validateCredentials(userName, passWord);
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token
    refreshTokens.add(refreshToken);
    
    res.status(200).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refresh token is required' 
      });
    }
    
    // Check if refresh token exists in storage
    if (!refreshTokens.has(refreshToken)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid refresh token' 
      });
    }
    
    // Verify refresh token
    const { valid, expired, decoded } = verifyRefreshToken(refreshToken);
    
    if (!valid) {
      // Remove invalid refresh token
      refreshTokens.delete(refreshToken);
      
      return res.status(403).json({ 
        success: false, 
        message: expired ? 'Refresh token has expired' : 'Invalid refresh token' 
      });
    }
    
    // Get user details
    let user;
    if (decoded.role === 'owner') {
      user = await Owner.findById(decoded.id);
      user.role = 'owner';
    } else {
      user = await User.findById(decoded.id);
      user.role = 'customer';
    }
    
    if (!user) {
      // Remove refresh token if user doesn't exist
      refreshTokens.delete(refreshToken);
      
      return res.status(403).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user);
    
    res.status(200).json({
      success: true,
      data: {
        accessToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Remove refresh token from storage
    refreshTokens.delete(refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  // If this middleware is reached, the token is valid
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
};
