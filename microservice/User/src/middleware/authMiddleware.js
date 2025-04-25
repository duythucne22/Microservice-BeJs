const AuthService = require('../services/authService');

exports.authenticateToken = async (req, res, next) => {
  try {
    // Get auth header
    const bearerHeader = req.headers['authorization'];
    
    if (!bearerHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = bearerHeader.split(' ')[1];
    
    // Verify token with Auth Service
    const authResponse = await AuthService.verifyToken(token);

    if (authResponse.success) {
      // Add user data to request
      req.user = authResponse.data.user;
      req.token = token;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized' 
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access forbidden' 
    });
  }
  
  next();
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
