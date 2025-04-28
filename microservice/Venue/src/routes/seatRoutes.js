const express = require('express');
const seatController = require('../controllers/seatController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no authentication required)
router.get('/stadium/:stadiumId', seatController.getSeatsByStadiumId);

// Protected routes (require authentication)
router.get('/', authenticateToken, seatController.getAllSeats);
router.get('/:id', authenticateToken, seatController.getSeatById);
router.post('/', authenticateToken, authorizeAdmin, seatController.createSeat);
router.post('/bulk', authenticateToken, authorizeAdmin, seatController.bulkCreateSeats);
router.put('/:id', authenticateToken, authorizeAdmin, seatController.updateSeat);
router.patch('/:id/status', authenticateToken, authorizeAdmin, seatController.updateSeatStatus);
router.delete('/:id', authenticateToken, authorizeAdmin, seatController.deleteSeat);

module.exports = router;
