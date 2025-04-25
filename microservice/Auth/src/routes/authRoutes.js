const express = require('express');
const authController = require('../controllers/authControllers');
const { validateLogin } = require('../middleware/validationMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/verify-token', authenticateToken, authController.verifyToken);

module.exports = router;
