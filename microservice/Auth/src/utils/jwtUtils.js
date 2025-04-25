const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      userName: user.userName,
      role: user.role || 'customer'  // Default role is customer
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

exports.verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return { 
      valid: false, 
      expired: error.name === 'TokenExpiredError', 
      decoded: null 
    };
  }
};

exports.verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return { 
      valid: false, 
      expired: error.name === 'TokenExpiredError', 
      decoded: null 
    };
  }
};
