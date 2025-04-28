const express = require('express');
const stadiumController = require('../controllers/stadiumController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no authentication required)
router.get('/', stadiumController.getAllStadiums);
router.get('/:id', stadiumController.getStadiumById);
router.get('/:id/seats', stadiumController.getStadiumWithSeats);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeAdmin, stadiumController.createStadium);
router.put('/:id', authenticateToken, authorizeAdmin, stadiumController.updateStadium);
router.delete('/:id', authenticateToken, authorizeAdmin, stadiumController.deleteStadium);

module.exports = router;
