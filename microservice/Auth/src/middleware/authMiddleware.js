const { verifyAccessToken } = require('../utils/jwtUtils');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token is required' 
    });
  }
  
  const { valid, expired, decoded } = verifyAccessToken(token);
  
  if (!valid) {
    return res.status(401).json({ 
      success: false, 
      message: expired ? 'Token has expired' : 'Invalid token' 
    });
  }
  
  req.user = decoded;
  next();
};

exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access forbidden' 
      });
    }
    
    next();
  };
};

exports.authorizeUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized' 
    });
  }
  
  const userId = parseInt(req.params.id);
  
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access forbidden' 
    });
  }
  
  next();
};
