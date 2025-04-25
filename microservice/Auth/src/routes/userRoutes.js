const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole, authorizeUser } = require('../middleware/authMiddleware');
const { validateUserRegistration, validatePasswordUpdate } = require('../middleware/validationMiddleware');
const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, userController.createUser);

// Protected routes
router.get('/', authenticateToken, authorizeRole(['admin']), userController.getAllUsers);
// xoa nhung use case cua user service di nha a Hieu 
router.get('/profile', authenticateToken, userController.getCurrentUser);
router.get('/:id', authenticateToken, authorizeUser, userController.getUserById);
router.put('/:id', authenticateToken, authorizeUser, userController.updateUser);
router.patch('/:id/password', authenticateToken, authorizeUser, validatePasswordUpdate, userController.updatePassword);
router.delete('/:id', authenticateToken, authorizeUser, userController.deleteUser);

module.exports = router;
