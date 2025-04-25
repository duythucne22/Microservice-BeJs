const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin, authorizeUser } = require('../middleware/authMiddleware');
const { validateUserUpdate, validateAddressUpdate } = require('../middleware/validationMiddleware');
const router = express.Router();

// Protected routes - Admin only
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);
router.get('/statistics', authenticateToken, authorizeAdmin, userController.getUserStatistics);
router.get('/search', authenticateToken, authorizeAdmin, userController.searchUsers);

// Protected routes - User or Admin
router.get('/profile', authenticateToken, userController.getCurrentUser);
router.get('/:id', authenticateToken, authorizeUser, userController.getUserById);
router.get('/username/:username', authenticateToken, userController.getUserByUsername);
router.put('/:id', authenticateToken, authorizeUser, validateUserUpdate, userController.updateUser);
router.patch('/:id/address', authenticateToken, authorizeUser, validateAddressUpdate, userController.updateAddress);

module.exports = router;
