const express = require('express');
const ownerController = require('../controllers/ownerControllers');
const { authenticateToken, authorizeRole, authorizeUser } = require('../middleware/authMiddleware');
const { validateOwnerRegistration, validatePasswordUpdate } = require('../middleware/validationMiddleware');
const router = express.Router();

// Public routes
router.post('/register', validateOwnerRegistration, ownerController.createOwner);

// Protected routes
router.get('/', authenticateToken, authorizeRole(['admin']), ownerController.getAllOwners);
router.get('/profile', authenticateToken, authorizeRole(['owner']), ownerController.getCurrentOwner);
router.get('/:id', authenticateToken, authorizeUser, ownerController.getOwnerById);
router.put('/:id', authenticateToken, authorizeUser, ownerController.updateOwner);
router.patch('/:id/password', authenticateToken, authorizeUser, validatePasswordUpdate, ownerController.updatePassword);
router.delete('/:id', authenticateToken, authorizeUser, ownerController.deleteOwner);

module.exports = router;
